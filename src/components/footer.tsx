"use client"

import { Mail, MapPin, Github, Twitter, Linkedin, MessageCircleMore } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="bg-background text-muted-foreground pt-10">
      <div className="max-w-7xl border-t mx-auto px-4 md:px-6 pt-10 pb-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-16">

          {/* Brand Section */}
          <div className="md:w-1/3 space-y-3">
            <h2 className="text-xl font-bold text-foreground">InstitutionPort</h2>
            <p className="text-sm leading-relaxed max-w-sm">
              Empowering learners and institutions through a modern platform.
            </p>
          </div>

          {/* Links Section */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12  text-sm">

            {/* Explore */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Explore</h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-6">
                <a href="/explore" className="hover:underline">Institutions</a>
                <a href="/about" className="hover:underline">About</a>
                <a href="/privacy" className="hover:underline">Privacy Policy</a>
                <a href="/terms" className="hover:underline">Terms of Use</a>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5" />
                  <a href="mailto:support@institutionport.com" className="hover:underline break-all">
                    support@institutionport.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MessageCircleMore className="h-4 w-4 mt-0.5" />
                  <a
                    href="https://wa.me/9779800000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    WhatsApp
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>Kathmandu, Nepal</span>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Social</h3>
              <div className="flex gap-4 items-center">
                <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noreferrer">
                  <Twitter className="h-5 w-5 hover:text-foreground" />
                </a>
                <a href="https://github.com" aria-label="GitHub" target="_blank" rel="noreferrer">
                  <Github className="h-5 w-5 hover:text-foreground" />
                </a>
                <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer">
                  <Linkedin className="h-5 w-5 hover:text-foreground" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <p className="text-xs text-center text-muted-foreground">
          © {new Date().getFullYear()} InstitutionPort. All rights reserved.
        </p>
      </div>
    </footer>

  )
}