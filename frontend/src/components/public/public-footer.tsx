'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, Shield, Mail } from 'lucide-react'

const footerLinks = {
  company: [
    { href: '/philosophy', label: 'Philosophy' },
    { href: '/security', label: 'Security' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/disclosures', label: 'Disclosures' },
  ],
}

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-950 border-t border-brand-800">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <span className="text-brand-900 font-display font-bold text-xl">R</span>
              </div>
              <span className="font-display font-semibold text-xl text-white">
                Bastion
              </span>
            </Link>
            <p className="text-brand-400 max-w-md mb-6">
              A disciplined, security-first approach to private wealth management.
              Clarity through transparency. Trust through consistency.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-brand-500">
                <Shield size={16} />
                <span>Security-First</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-500">
                <Lock size={16} />
                <span>Confidential</span>
              </div>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-brand-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-brand-500">
            &copy; {currentYear} Bastion. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/members/login"
              className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-white transition-colors"
            >
              <Lock size={14} />
              Member Login
            </Link>
            <a
              href="mailto:contact@bastion.com"
              className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-white transition-colors"
            >
              <Mail size={14} />
              Contact
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-brand-800">
          <p className="text-xs text-brand-600 leading-relaxed">
            <strong>Important Disclosure:</strong> This website is for informational
            purposes only and does not constitute investment advice, an offer to sell,
            or a solicitation of an offer to buy any securities. Past performance is
            not indicative of future results. All investments involve risk, including
            the potential loss of principal. Before making any investment decisions,
            please consult with a qualified financial advisor.
          </p>
        </div>
      </div>
    </footer>
  )
}
