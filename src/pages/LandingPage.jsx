import React, { useEffect, useState } from 'react';
import BlurIn from '@/components/ui/blur-in';
import TypingAnimation from '@/components/ui/typing-animation';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { cn } from "@/lib/utils";
import GridPattern from "@/components/ui/grid-pattern";

import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle, Users, Vote, BarChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import AuthButton from '@/components/LoginButton';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardContent className="flex flex-col items-center p-6">
      <Icon className="w-12 h-12 text-blue-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-center">{description}</p>
    </CardContent>
  </Card>
);

const StepCard = ({ step, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: Number(step) * 0.1 }}
  >
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="flex flex-col items-center p-6">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl mb-4">
          {step}
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-center">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState();
  const [notification, setNotification] = useState(null); // State to manage notifications
  const { isAuthenticated, loginWithRedirect, isLoading, user } = useAuth0();

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Notification disappears after 3 seconds
  };

  const getStartedButtonHandler = () => {
    if (isAuthenticated) {
      showNotification("Logged in successfully!", "success");
      navigate("/dashboard");
    } else {
      loginWithRedirect();
    }
  };

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        if (isLoading) {
          showNotification("Loading... Please wait.", "info");
          return;
        }

        if (isAuthenticated && user?.email) {
          setUserEmail(user.email);
          showNotification(`Welcome, ${user.name}!`, "success");
        }
      } catch (error) {
        showNotification("Error fetching user details.", "error");
        console.error("Error fetching user email:", error);
      }
    };

    fetchUserEmail();
  }, [isAuthenticated, user, isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900 transition-colors duration-300">
      {/* Top Notification */}
      {notification && (
        <div
          className={`fixed  top-2 left-1/2 w-auto z-50 p-3 text-center text-whiten rounded-md ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="top-0 bg-white/75 dark:bg-gray-900/75 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <BlurIn word="ElectNow" className="text-xl font-bold text-blue-600 dark:text-blue-400" />
          <AuthButton />
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-4">
          <TypingAnimation
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
            text="Simplify Your Elections with ElectNow"
          />
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Create elections, add members, and manage votes effortlessly
          </p>
          <RainbowButton onClick={getStartedButtonHandler} className="text-lg px-8 py-3">
            Get Started <ChevronRight className="ml-2 h-5 w-5" />
          </RainbowButton>
        </div>
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900">
          <div className="absolute h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Users}
              title="Custom Election Creation"
              description="Easily add positions and members dynamically."
            />
            <FeatureCard
              icon={Vote}
              title="Real-Time Voting"
              description="Secure and instant voting results."
            />
            <FeatureCard
              icon={BarChart}
              title="User-Friendly Interface"
              description="Simple and intuitive design for all users."
            />
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
      <footer className="py-8 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0"></p>
            <div className="flex space-x-4">
              <a href="https://github.com/Kiranraj2004/ElectNow" className="hover:text-blue-500 transition-colors duration-300">code </a>
              <a href="https://www.linkedin.com/in/kiran-raj-a174b0287/" className="hover:text-blue-500 transition-colors duration-300">linkedin</a>
              {/* <a href="kiranrajb5882@gmail.com" className="hover:text-blue-500 transition-colors duration-300">Contact</a> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
