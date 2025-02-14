import React from 'react'
import { Footer as FooterSuite } from 'rsuite'
import './footer.scss'

const Footer: React.FC = () => {
  return (
    <FooterSuite className="footer">
      <div className="footer__center">
        <p>
          &copy; 2024 placeMe. All rights reserved. Designed and developed by
          Team TechThinker.
        </p>
      </div>
    </FooterSuite>
  )
}

export default Footer
