// lib/jobScraper.js
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export async function fetchJobs(params) {
  try {
    // Construct the query string conditionally
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(val => queryParams.append(key, val));
      } else if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const url = `${serverRuntimeConfig.PUBLIC_API_ENDPOINT}/jobs?${queryParams.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}
