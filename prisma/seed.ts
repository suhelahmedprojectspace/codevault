import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function updateCertifications() {
  const portfolioId = 'cmagcivmu0001uv0g3hqtj0gc';

  const certifications = [
    {
      id: 'cert-1',
      title: 'Meta Front-End Developer Certificate',
      description: 'Completed an in-depth program covering HTML, CSS, JavaScript, and React.',
      url: 'https://coursera.org/verify/meta-front-end-cert',
    },
    {
      id: 'cert-2',
      title: 'JavaScript Algorithms and Data Structures',
      description: 'Completed 300+ coding challenges via freeCodeCamp.',
      url: 'https://freecodecamp.org/certification/js-algo',
    },
    {
      id: 'cert-3',
      title: 'AWS Certified Cloud Practitioner',
      description: 'Learned core AWS services and cloud security best practices.',
      url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    },
  ];

  await prisma.portfolio.update({
    where: { id: portfolioId },
    data: {
      certifications: certifications, // This will overwrite existing certifications
    },
  });

  console.log('Certifications updated for portfolio:', portfolioId);
}

updateCertifications()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
