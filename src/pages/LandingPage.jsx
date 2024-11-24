// src/pages/LandingPage.jsx
import BlurIn from '@/components/ui/blur-in';
import TypingAnimation from '@/components/ui/typing-animation';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { cn } from "@/lib/utils";
import GridPattern from "@/components/ui/grid-pattern";

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import AuthButton from '@/components/LoginButton';


import { useNavigate } from 'react-router-dom';
const FeatureCard = ({ title, description }) => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
    <h3 className="font-bold text-lg mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

const StepCard = ({ step, description }) => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
    <h4 className="font-bold text-xl text-blue-500 mb-2">Step {step}</h4>
    <p>{description}</p>
  </div>
);

const LandingPage = () => {
  const navigate=useNavigate();

  return (
    <div className="min-h-screen  transition-colors duration-300">
      {/* Navigation Bar */}

      <nav className="p-4  bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex justify-between items-center">
        <BlurIn
          word="ElectNow"
          className="text-sm  text-black dark:text-white"
        > </BlurIn>

    
      <AuthButton />
      </nav>

      {/* Hero Section */}
      <header className="py-16   bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-center">
      <TypingAnimation
      className="text-4xl text-black dark:text-white font-bold mb-4"
      text="Simplify Your Elections with ElectNow"
      ></TypingAnimation>

        <p className="text-lg text-black dark:text-white mb-6">
        Create elections, add members, and manage votes effortlessly
        </p>
        
        
        <RainbowButton  onClick={()=>{navigate('/dashboard')}}> Get Started </RainbowButton>

       
        

        <GridPattern
        width={50}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"0 0"}
        className={cn(
          "[mask-image:radial-gradient(200px_circle_at_center,white,transparent)]",
        )}
      />
      </header>
    
      {/* Features Section */}
      <section className="py-12 bg-white dark:bg-black text-gray-900 dark:text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="Custom Election Creation"
              description="Easily add positions and members dynamically."
            />
            <FeatureCard
              title="Real-Time Voting"
              description="Secure and instant voting results."
            />
            <FeatureCard
              title="User-Friendly Interface"
              description="Simple and intuitive design for all users."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StepCard
              step="1"
              description="Sign in with Google to get started."
            />
            <StepCard
              step="2"
              description="Create an election by adding positions and members."
            />
            <StepCard
              step="3"
              description="Share the election code with voters."
            />
            <StepCard
              step="4"
              description="View results after voting closes."
            />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-6 bg-blue-500 dark:bg-blue-700 text-white text-center">
        <p>© {new Date().getFullYear()} ElectNow. All Rights Reserved.</p>
        <div className="mt-2">
          <a href="#" className="mr-4 hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="mr-4 hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
