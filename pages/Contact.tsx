// FIX: Re-added React types reference directive to resolve JSX intrinsic elements errors.
/// <reference types="react" />
import React from 'react';
import { Card } from '../components/Card';

export const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
        <div className="grid md:grid-cols-2 gap-8 text-gray-700 dark:text-gray-300">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
            <p>
              For inquiries, support, or feedback regarding the Career Guidance Platform, please contact the Department of Computer Science.
            </p>
            <div>
              <h3 className="font-bold">Address:</h3>
              <p>Department of Computer Science,</p>
              <p>Federal Polytechnic Bida,</p>
              <p>P.M.B. 55, Bida, Niger State, Nigeria.</p>
            </div>
             <div>
              <h3 className="font-bold">Email:</h3>
              <p>computerscience@fedpolybida.edu.ng (sample)</p>
            </div>
             <div>
              <h3 className="font-bold">Phone:</h3>
              <p>+234-XXX-XXX-XXXX (sample)</p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Send a Message</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium">Your Name</label>
                <input type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
              </div>
               <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium">Your Email</label>
                <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
              </div>
               <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium">Your Message</label>
                <textarea id="message" rows={4} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required></textarea>
              </div>
              <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Submit</button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};