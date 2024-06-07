# main.py
from fastapi import FastAPI, HTTPException, Query
from jobspy import scrape_jobs

import numpy as np
from typing import List, Optional

app = FastAPI()

@app.get("/")
def read_root():
    try:
        jobs_df = scrape_jobs(
            site_name=["indeed"],
            search_term="software engineer",
            location="Dallas, TX",
            results_wanted=5,
            hours_old=72,  # (only Linkedin/Indeed is hour specific, others round up to days old)
            country_indeed='USA',  # only needed for indeed / glassdoor
            # linkedin_fetch_description=True # get full description and direct job url for linkedin (slower)
            # proxies=["208.195.175.46:65095", "208.195.175.45:65095", "localhost"],
        )

        if jobs_df is None or jobs_df.empty:
            raise HTTPException(status_code=404, detail="No jobs found")

        # Replace NaN and infinite values with None
        jobs_df.replace({np.nan: None, np.inf: None, -np.inf: None}, inplace=True)

        # Convert DataFrame to a list of dictionaries
        jobs_json = jobs_df.to_dict(orient="records")
        return jobs_json

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/jobs")
def read_jobs(
    search_term: Optional[str] = None,
    location: Optional[str] = None,
    distance: Optional[int] = 50,
    job_type: Optional[str] = None,
    proxies: Optional[List[str]] = Query(None),
    is_remote: Optional[bool] = None,
    results_wanted: Optional[int] = 10,
    easy_apply: Optional[bool] = None,
    description_format: Optional[str] = 'markdown',
    offset: Optional[int] = 0,
    hours_old: Optional[int] = None,
    verbose: Optional[int] = 2,
    country_indeed: Optional[str] = None,
):
    try:
        # Build arguments dictionary
        args = {
            "search_term": search_term,
            "location": location,
            "distance": distance,
            "job_type": job_type,
            "proxies": proxies,
            "is_remote": is_remote,
            "results_wanted": results_wanted,
            "easy_apply": easy_apply,
            "description_format": description_format,
            "offset": offset,
            "hours_old": hours_old,
            "verbose": verbose,
            "country_indeed": country_indeed,
        }

        # Filter out None values
        args = {k: v for k, v in args.items() if v is not None}
        args['site_name'] = ["indeed"]

        jobs_df = scrape_jobs(**args)

        if jobs_df is None or jobs_df.empty:
            raise HTTPException(status_code=404, detail="No jobs found")

        # Replace NaN and infinite values with None
        jobs_df.replace({np.nan: None, np.inf: None, -np.inf: None}, inplace=True)

        # Convert DataFrame to a list of dictionaries
        jobs_json = jobs_df.to_dict(orient="records")
        return {"jobs": jobs_json}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))