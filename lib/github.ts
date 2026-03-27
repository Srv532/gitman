export const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || "";

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export type Result<T> = { data: T | null; error: string | null; resetAt?: number | null };

async function fetchWithCache<T>(cacheKey: string, url: string, isGraphQL = false, body?: any): Promise<Result<T>> {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          return { data: parsed.data, error: null };
        }
      } catch (e) {
        // invalid JSON cache, ignore
      }
    }
  }

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const options: RequestInit = {
    method: isGraphQL ? "POST" : "GET",
    headers,
  };
  
  if (isGraphQL && body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);
    const resetHeader = res.headers.get("x-ratelimit-reset");
    const resetAt = resetHeader ? parseInt(resetHeader, 10) * 1000 : null;

    if (!res.ok) {
      if (res.status === 404) return { data: null, error: "Not found", resetAt };
      if (res.status === 403) return { data: null, error: "Rate limit exceeded", resetAt };
      if (res.status === 401) return { data: null, error: "Unauthorized (Bad Token)", resetAt };
      return { data: null, error: `Error ${res.status}: ${res.statusText}`, resetAt };
    }

    const data = await res.json();
    
    // Some GraphQL errors return HTTP 200 with an errors field
    if (isGraphQL && data.errors) {
       return { data: null, error: data.errors[0].message, resetAt };
    }
    
    if (typeof window !== "undefined") {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    }
    return { data, error: null, resetAt };
  } catch (err: any) {
    return { data: null, error: err.message, resetAt: null };
  }
}

export async function fetchUserProfile(username: string) {
  return fetchWithCache<any>(
    `gitman__fetchUserProfile__${username}`,
    `https://api.github.com/users/${username}`
  );
}

export async function fetchUserRepos(username: string) {
  // We'll fetch up to 2 pages (200 repos)
  const key = `gitman__fetchUserRepos__${username}`;
  
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          return { data: parsed.data, error: null };
        }
      } catch (e) {}
    }
  }

  const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  
  try {
    const res1 = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
    if (!res1.ok) throw new Error("Failed to fetch page 1");
    let data = await res1.json();
    
    // limit second page fetch
    if (data.length === 100) {
       const res2 = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=2&sort=updated`, { headers });
       if (res2.ok) {
         const d2 = await res2.json();
         data = [...data, ...d2];
       }
    }
    
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    }
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
}

export async function fetchUserOrgs(username: string) {
  return fetchWithCache<any[]>(
    `gitman__fetchUserOrgs__${username}`,
    `https://api.github.com/users/${username}/orgs`
  );
}

export async function fetchUserFollowers(username: string) {
  return fetchWithCache<any[]>(
    `gitman__fetchUserFollowers__${username}`,
    `https://api.github.com/users/${username}/followers?per_page=30`
  );
}

export async function fetchUserEvents(username: string) {
  return fetchWithCache<any[]>(
    `gitman__fetchUserEvents__${username}`,
    `https://api.github.com/users/${username}/events/public?per_page=100`
  );
}

export async function fetchRepoDetails(owner: string, repo: string) {
  return fetchWithCache<any>(
    `gitman__fetchRepoDetails__${owner}/${repo}`,
    `https://api.github.com/repos/${owner}/${repo}`
  );
}

export async function fetchRepoContributors(owner: string, repo: string) {
  return fetchWithCache<any[]>(
    `gitman__fetchRepoContributors__${owner}/${repo}`,
    `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=20`
  );
}

export async function fetchRepoCommits(owner: string, repo: string) {
  return fetchWithCache<any[]>(
    `gitman__fetchRepoCommits__${owner}/${repo}`,
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=30`
  );
}

export async function fetchRepoLanguages(owner: string, repo: string) {
  return fetchWithCache<Record<string, number>>(
    `gitman__fetchRepoLanguages__${owner}/${repo}`,
    `https://api.github.com/repos/${owner}/${repo}/languages`
  );
}

export async function fetchRepoReadme(owner: string, repo: string) {
  return fetchWithCache<any>(
    `gitman__fetchRepoReadme__${owner}/${repo}`,
    `https://api.github.com/repos/${owner}/${repo}/readme`
  );
}

export async function fetchContributionCalendar(username: string) {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          totalRepositoriesWithContributedCommits
        }
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              primaryLanguage {
                name
                color
              }
              stargazerCount
              forkCount
            }
          }
        }
      }
    }
  `;
  
  return fetchWithCache<any>(
    `gitman__fetchContributionCalendar__${username}`,
    `https://api.github.com/graphql`,
    true,
    { query, variables: { username } }
  );
}
