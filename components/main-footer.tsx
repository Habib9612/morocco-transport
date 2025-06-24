import Link from "next/link"
import { Truck, Facebook, Twitter, Linkedin, Instagram, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MainFooter() {
  const year = new Date().getFullYear()

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Enterprise", href: "/enterprise" },
        { label: "Integrations", href: "/integrations" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Help Center", href: "/help" },
        { label: "API Documentation", href: "/api-docs" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Data Processing", href: "/data-processing" },
        { label: "Cookies", href: "/cookies" },
      ],
    },
  ]

  return (
    <footer className="bg-gray-900 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" />
              </div>
              <span className="font-bold text-xl">MarocTransit</span>
            </Link>

            <p className="text-gray-400 text-base max-w-md">
              Revolutionizing Morocco&apos;s logistics industry with our AI-powered digital freight marketplace. Connecting
              shippers with carriers through cutting-edge technology.
            </p>

            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {footerLinks.slice(0, 2).map((group) => (
                <div key={group.title}>
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">{group.title}</h3>
                  <ul className="space-y-4">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="text-base text-gray-400 hover:text-white">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {footerLinks.slice(2, 4).map((group) => (
                <div key={group.title}>
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">{group.title}</h3>
                  <ul className="space-y-4">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="text-base text-gray-400 hover:text-white">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
                Subscribe to our newsletter
              </h3>
              <p className="text-base text-gray-400 mb-4">
                The latest news, articles, and resources, sent to your inbox weekly.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  className="bg-gray-800 border-gray-700 focus-visible:ring-blue-500 text-white"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-500">By subscribing, you agree to our Privacy Policy.</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex space-x-6">
                <div className="text-sm text-gray-400">
                  Contact:{" "}
                  <a href="mailto:info@maroctransit.com" className="hover:text-white">
                    info@maroctransit.com
                  </a>
                </div>
                <div className="text-sm text-gray-400">
                  Phone:{" "}
                  <a href="tel:+2125XXXXXXX" className="hover:text-white">
                    +212 5XX-XXXX
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-400">&copy; {year} MarocTransit, Inc. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="flex space-x-4 text-gray-400 text-sm">
                <span>Terms</span>
                <span>Privacy</span>
                <span>Cookies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
