import './Services.scss'
import {
  FaBriefcase,
  FaClock,
  FaFileAlt,
  FaLaptopCode,
  FaUsers,
  FaEnvelopeOpenText,
  FaBullhorn,
} from 'react-icons/fa'

const services = [
  {
    icon: <FaBriefcase />,
    title: 'Job Application Portal',
    description:
      'Search, filter, and apply for verified jobs and internships directly from the platform.',
  },
  {
    icon: <FaClock />,
    title: 'Real-Time Updates',
    description:
      'Stay informed with real-time notifications on shortlisting, interviews, and results.',
  },
  {
    icon: <FaFileAlt />,
    title: 'Resume Builder & Templates',
    description:
      'Generate professional resumes with pre-designed, ATS-optimized templates.',
  },
  {
    icon: <FaLaptopCode />,
    title: 'Placement Management Dashboard',
    description:
      'Colleges can manage placement workflows, student performance, and reports in one place.',
  },
  {
    icon: <FaClock />,
    title: 'Interview Scheduling Tool',
    description:
      'Easily assign time slots and notify students with our smart scheduling system.',
  },
  {
    icon: <FaUsers />,
    title: 'Candidate Pool Access',
    description:
      'Recruiters can browse through verified student profiles and shortlists with ease.',
  },
  {
    icon: <FaEnvelopeOpenText />,
    title: 'Bulk Shortlisting & Emailing',
    description:
      'Send interview calls or offer letters to multiple candidates with one click.',
  },
  {
    icon: <FaBullhorn />,
    title: 'Custom Job Posting Panel',
    description:
      'Post openings and track student engagement with smart analytics.',
  },
]

const Services = () => {
  return (
    <section className='services-section'>
      <div className='section-header'>
        <h1>Our Services</h1>
        <p>
          We provide powerful tools to enhance the recruitment experience for
          students, colleges, and recruiters.
        </p>
        <div className='styled-separator'></div>
      </div>
      <div className='services-grid'>
        {services.map((service, index) => (
          <div className='service-card fade-in-up' key={index}>
            <div className='icon-box'>{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services
