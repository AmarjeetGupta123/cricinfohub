import React from 'react'
import Header from './Component/Header/Header'
import Hero from './Component/Slider/Hero'
import Questions from './Component/Question/Question'
import Preview from './Component/PREVIEW/Preview'
import Features from './Component/Features/Features'
import Pricing from './Component/Pricing/Pricing'
import Review from './Component/Review/Review'
import Faq from './Component/Faq/Faq'
import Footer from './Component/Footer/Footer'

function Ebook() {
  return (
    <div>
      <Header/>
      <Hero/>
      <Questions/>
      <Preview/>
      <Features/>
      <Pricing/>
      <Review/>
      <Faq/>
      <Footer/>
    </div>
  )
}

export default Ebook