// app/api/jobs/route.js
import { fetchJobs } from '@/lib/jobScraper';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const urlParams = Object.fromEntries(searchParams.entries());

  const jobs = await fetchJobs(urlParams);
  return new Response(JSON.stringify(jobs), { status: 200 });
}
