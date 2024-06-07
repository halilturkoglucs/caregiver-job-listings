'use client';

import {useState, useEffect, useCallback} from 'react';
import Link from 'next/link';
import axios from 'axios';

type Job = {
  id: string;
  site: string;
  job_url: string;
  job_url_direct: string | null;
  title: string;
  company: string | null;
  location: string;
  job_type: string | null;
  date_posted: string;
  interval: string | null;
  min_amount: number | null;
  max_amount: number | null;
  currency: string | null;
  is_remote: boolean;
  job_function: string | null;
  emails: string | null;
  description: string;
  company_url: string | null;
  company_url_direct: string | null;
  company_addresses: string | null;
  company_industry: string | null;
  company_num_employees: string | null;
  company_revenue: string | null;
  company_description: string | null;
  logo_photo_url: string | null;
  banner_photo_url: string | null;
  ceo_name: string | null;
  ceo_photo_url: string | null;
};

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTrigger, setSearchTrigger] = useState(false);
  const [filters, setFilters] = useState({
    search_term: '',
    location: '',
    job_type: '',
    is_remote: false,
    results_wanted: 29,
    offset: 0,
  });

  const loadMoreJobs = useCallback(() => {
    setLoading(true);
    const params = {...filters, offset: (page - 1) * filters.results_wanted};

    axios.get('/api/jobs', {params})
      .then(response => {
        if (response?.data?.jobs) {
          setJobs([...response.data.jobs]);
          setHasMore(response.data.jobs.length >= filters.results_wanted);
          setLoading(false);
        } else {
          if (response?.data?.detail.indexOf('404') >= 0) {
            setJobs([]);
            setHasMore(false);
            setLoading(false);
          } else {
            console.log('Error fetching jobs, response: ', response)
          }
        }
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      });
  }, [page, filters]);

  useEffect(() => {
    loadMoreJobs();
  }, [page, searchTrigger]);

  const handleFilterChange = (e) => {
    const {name, value, type, checked} = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value,
      offset: 0,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchTrigger(prev => !prev); // Toggle the search trigger
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
      setFilters(prevFilters => ({...prevFilters, offset: filters.offset - filters.results_wanted}));
      setLoading(true);
      setJobs([]);
    }
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
    setFilters(prevFilters => ({...prevFilters, offset: filters.offset + filters.results_wanted}));
    setLoading(true);
    setJobs([]);
  };

  const formatDatePosted = (datePosted) => {
    const date = new Date(datePosted);
    const now = new Date();
    const differenceInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (differenceInDays <= 0) {
      return 'Today';
    } else if (differenceInDays === 1) {
      return '1 day ago';
    } else {
      return `${differenceInDays} days ago`;
    }
  };

  const handleJobClick = (job) => {
    const jobData = encodeURIComponent(JSON.stringify(job));
    return `/jobs/${job.id}?job=${jobData}`;
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-4">Job Listings</h1>
      </div>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="row">
          <div className="col-md-3 mb-3">
            <input
              type="text"
              name="search_term"
              value={filters.search_term}
              onChange={handleFilterChange}
              placeholder="Search term"
              className="form-control"
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Location"
              className="form-control"
            />
          </div>
          <div className="col-md-3 mb-3">
            <select
              name="job_type"
              value={filters.job_type}
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="">Job Type</option>
              <option value="fulltime">Fulltime</option>
              <option value="parttime">Parttime</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
          </div>
          <div className="col-md-3 mb-3 d-flex align-items-center">
            <div className="form-check">
              <input
                type="checkbox"
                name="is_remote"
                checked={filters.is_remote}
                onChange={handleFilterChange}
                className="form-check-input"
              />
              <label className="form-check-label">Remote</label>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p>Current Page: {page}</p>
        <div>
          <button onClick={handlePreviousPage} disabled={page === 1 || loading} className="btn btn-secondary me-2">
            Previous
          </button>
          <button onClick={handleNextPage} disabled={!hasMore || loading} className="btn btn-secondary">
            Next
          </button>
        </div>
      </div>
      {!loading && (!jobs || jobs.length === 0) && <div className="alert alert-warning">No jobs found</div>}
      {!loading && (jobs && jobs.length > 0) &&
          <div className="row">
            {jobs.map(job => (
              <div key={job.id} className="col-12 mb-4">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        style={{color: '#7D3C98', fontWeight: 'bold'}}>{filters?.job_type?.toUpperCase() || "STAFF POSITION"}</span>
                    </div>
                    <Link href={job.job_url} legacyBehavior>
                      <a target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                        <h5 className="card-title mt-3">{job.title}</h5>
                      </a>
                    </Link>
                    <h6
                      className="card-subtitle mb-2 text-muted">{job.company ? job.company : "Company not specified"}</h6>
                    <p className="card-text">{job.location}</p>
                    {job.min_amount && job.max_amount ? (
                      <p className="card-text text-success" style={{fontSize: '1.25rem'}}>
                        {job.currency} {job.min_amount}+/{job.interval}
                      </p>
                    ) : (
                      <p className="card-text">Salary not specified</p>
                    )}
                    <Link href={handleJobClick(job)} legacyBehavior>
                      <a className="btn btn-success">I'm interested</a>
                    </Link>
                    <p className="text-muted mt-2" style={{fontSize: '0.875rem'}}>
                      Posted <span style={{fontWeight: 'bold'}}>{formatDatePosted(job.date_posted)}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
      }
      {loading && <p className="text-center">Loading jobs...</p>}
    </div>
  );
}
