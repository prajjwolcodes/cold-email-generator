'use client'

import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <header className="max-w-4xl mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="font-bold text-xl text-emerald-500">Cold Email</div>
          <div className="flex gap-8">
            <Link href="https://github.com/prajjwolcodes/cold-email-generator" className="text-gray-600 hover:text-gray-900">
              Guides
            </Link>
           
          </div>
        </nav>
      </header>
  )
}

export default Navbar