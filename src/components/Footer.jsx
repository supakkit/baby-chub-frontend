import React from "react";

const SocialIcons = {
  Facebook: (props) => (
    <svg
      {...props}
      xmlns="http://www.w.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Instagram: (props) => (
    <svg
      {...props}
      xmlns="http://www.w.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
  Twitter: (props) => (
    <svg
      {...props}
      xmlns="http://www.w.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9s-1.4-.6-2.8-.9c-1.2 2.2-2.8 4-4.8 4.6s-4.5-.5-5.3-2.2c-1.1-.9-2.2-2.3-2.2-4.1s.6-3.7 2.3-5.2c1.4-1.2 3.3-1.8 5.1-1.8s3.2.5 4.7 1.3c.3-.1 1.1-.4 1.1-.4s-.3.8-.8 1.4c.5.5.9.9 1.3 1.3z" />
    </svg>
  ),
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="layout mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">BabyChub</h3>
            <p className="text-primary-foreground/80">
              Digital products for young learners, designed to spark joy and
              creativity.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <SocialIcons.Facebook />
              </a>
              <a
                href="#"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <SocialIcons.Instagram />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold uppercase tracking-wider">Support</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/help#help-top"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/help#faq"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/help#contact"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/help#privacy"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/help#terms"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold uppercase tracking-wider">
              Get in Touch
            </h4>
            <address className="not-italic text-primary-foreground/80">
              10 Junior Software Developer Lane,
              <br />
              Generation, Thailand 10110
              <br />
              contact@babychub.com
              <br />
              <a
                href="https://www.google.com/maps/search/?api=1&query=Generation%20Thailand"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 underline-offset-2"
              >
                Find Store (Google Maps)
              </a>
            </address>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          &copy; {currentYear} BabyChub. All Rights Reserved. A digital creation
          with ❤️.
        </div>
      </div>
    </footer>
  );
}
