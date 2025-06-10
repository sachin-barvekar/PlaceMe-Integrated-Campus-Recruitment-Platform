import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import './HeroSection.scss'


const slides = [
  {
    image: 'https://elearn.websitelayout.net/img/banner/slide3.jpg',
    heading: 'Your Career Begins Here with PlaceMe',
  },
  {
    image: 'https://elearn.websitelayout.net/img/banner/slide1.jpg',
    heading: 'Connecting Talent with Opportunity',
  },
  {
    image: 'https://elearn.websitelayout.net/img/banner/slide2.jpg',
    heading: 'Launch Your Career with Confidence',
  },
]

const HeroCarousel = () => {
  return (
    <section className='hero-carousel'>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        loop={true}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        navigation={true}
        className='hero-swiper'>
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className='hero-slide'
              style={{ backgroundImage: `url(${slide.image})` }}>
              <div className='overlay'>
                <div className='container1'>
                  <div className='content'>
                    <span>Enjoy smooth learning</span>
                    <h1>{slide.heading}</h1>
                    <div className='buttons'>
                      <a href='/contact' className='btn primary'>
                        Learn More
                      </a>
                      <a href='/courses-list' className='btn white'>
                        Our Courses
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default HeroCarousel
