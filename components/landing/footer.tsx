import Link from "next/link"
import { Truck, Facebook, Twitter, Linkedin, Instagram, ArrowRight, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  const year = new Date().getFullYear()

  const footerLinks = [
    {
      title: "Services",
      links: [
        { label: "Global Shipping", href: "/services/global-shipping" },
        { label: "Freight Forwarding", href: "/services/freight-forwarding" },
        { label: "Warehousing", href: "/services/warehousing" },
        { label: "Supply Chain", href: "/services/supply-chain" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "News", href: "/news" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "FAQ", href: "/faq" },
        { label: "Support", href: "/support" },
        { label: "Partners", href: "/partners" },
      ],
    },
  ]

  return (
    <footer className="bg-black text-white border-t border-gray-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl">MarocTransit</span>
            </Link>

            <p className="text-gray-400 text-base max-w-md">
              Morocco's leading logistics platform providing efficient and reliable shipping solutions for businesses
              and individuals.
            </p>

            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-orange-500 mr-3 mt-0.5" />
                <span className="text-gray-300">123 Logistics Avenue, Casablanca, Morocco</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-orange-500 mr-3" />
                <span className="text-gray-300">+212 5XX-XXXX</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-orange-500 mr-3" />
                <span className="text-gray-300">info@maroctransit.com</span>
              </div>
            </div>

            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-orange-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange-500">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange-500">
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
                        <Link href={link.href} className="text-base text-gray-400 hover:text-orange-500">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">{footerLinks[2].title}</h3>
              <ul className="space-y-4">
                {footerLinks[2].links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-base text-gray-400 hover:text-orange-500">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mt-8 mb-4">
                Subscribe to our newsletter
              </h3>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-orange-500"
                />
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-gray-400">&copy; {year} MarocTransit. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center">
            <div className="flex space-x-4 text-gray-400 text-sm">
              <Link href="/terms" className="hover:text-orange-500">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-orange-500">
                Privacy
              </Link>
              <Link href="/cookies" className="hover:text-orange-500">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
