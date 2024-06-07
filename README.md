This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

You can watch the demo showing how frontend and backend works together on Youtube:

[Firstly, you can watch the demo here in Youtube]](https://youtu.be/7qilWyvgf74)

# Dependencies

If you want to run it locally, please install the npm version mentioned in .nvmrc, you can also use `nvm` for this.

This project uses the below external dependencies in extra:
## Backend
- jobSpy to parse indeed jobs
- FastAPI to serve backend rest endpoints: It has a / path for test use to ensure the JobSpy is working
and another endpoint to filter jobs based on frontend criteria

## Frontend
- axios to fetch the jobs
- bootstrap for responsive design

## Technical Decisions

1. In the screenshots, there's a count field, however, we don't see a count api in JobScraper, thus, 
instead of showing the total count we always show a fix number e.g. 5 and implement pagination to navigate between.
2. Where appropriate, we tried to show placeholder data such as 'Salary not available'
3. Since we get json array result from the scraper backend, currently we don't know any way to query 
for a single result by using its id. Thus, we send along the same json object to the `jobs\[id]` page to reuse it.
4. The JobSpy backend only supports filtering by US locations such as 'Texas', 'California' 
since it uses Indeed US data for simplicity, so it wouldn't filter by locations such as Turkiye.
5. Warning: Somehow, the JobSpy doesn't return results for the subsequent pages, it may be a bug with their offset parameter.

## Getting Started - Backend
The server folder contains backend code that is a simple FastAPI api to be able to use the suggested 
(JobSpy library)[https://github.com/Bunsly/JobSpy]

- First make sure you have python 3.10 or above installed
- Install python app using a virtual environment:
`python -m venv venv`
`source venv/bin/activate`
`pip install -r requirements.txt`
- Run the backend API `uvicorn main:app --reload` or using your IDEA
You can specify a certain port: `uvicorn main:app --host 127.0.0.1 --port 8080 --reload`

## Getting Started - Front End

We need to tell the app which endpoint to use because it uses a python FastAPI backend server to scrape Indeed:

1. nextJS server configuration defines a PUBLIC_API_ENDPOINT, you can change it according to your backend in
`next.config.mjs`, currently it uses:
```next.config.mjs
  serverRuntimeConfig: {
    // Will only be available on the server side
    PUBLIC_API_ENDPOINT: 'http://127.0.0.1:8000',
  },
```

2. in the main directory
`nvm use` 
to use correct version of nodejs if you use nvm, if not, please install the version mentioned in `.nvmrc`

3. Now, we can run our app for development:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

