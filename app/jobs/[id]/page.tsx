'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Row, Col, Button, Tab, Tabs } from 'react-bootstrap';

const JobDetail = () => {
  const searchParams = useSearchParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const jobData = searchParams.get('job');
    if (jobData) {
      setJob(JSON.parse(jobData));
    }
  }, [searchParams]);

  if (!job) {
    return <div>Loading...</div>;
  }

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

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <span style={{ color: '#7D3C98', fontWeight: 'bold' }}>{job.company_industry || "STAFF POSITION"}</span>
          </div>
          <h4 className="mt-3">{job.title}</h4>
          <h6 className="text-muted">{job.company ? job.company : "Company not specified"}</h6>
          <p className="text-muted">{job.location}</p>
          {job.min_amount && job.max_amount ? (
            <p className="text-success" style={{ fontSize: '1.5rem' }}>
              {job.currency} {job.min_amount}+/{job.interval}
            </p>
          ) : (
            <p>Salary not specified</p>
          )}
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>
            Posted <span style={{ fontWeight: 'bold' }}>{formatDatePosted(job.date_posted)}</span>
          </p>
          <div className="d-flex">
            <Button variant="outline-secondary" className="me-2">Share</Button>
            <Button variant="success" onClick={() => window.open(job.job_url, '_blank')}>I'm interested</Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs defaultActiveKey="overview" id="job-details-tabs" className="mb-3">
            <Tab eventKey="overview" title="Overview">
              <p className="text-center mt-3">{job.description}</p>
            </Tab>
            <Tab eventKey="pay" title="Pay">
              <p className="text-center mt-3">{job.min_amount && job.max_amount ? `${job.currency} ${job.min_amount} - ${job.max_amount} ${job.interval}` : 'Salary not specified'}</p>
            </Tab>
            <Tab eventKey="benefits" title="Benefits">
              <p className="text-center mt-3">Benefits information not available</p>
            </Tab>
            <Tab eventKey="employer" title="Employer">
              <p className="text-center mt-3">{job.company_description || 'Employer information not available'}</p>
            </Tab>
            <Tab eventKey="location" title="Location">
              <p className="text-center mt-3">{job.company_addresses || 'Location information not available'}</p>
            </Tab>
            <Tab eventKey="similarJobs" title="Similar Jobs">
              <p className="text-center mt-3">To be implemented</p>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default JobDetail;
