"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Amenities from "@/components/Amenities";
import Location from "@/components/Location";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Interactive3D from "@/components/Interactive3D";
import BuildingExplorer from "@/components/BuildingExplorer";

import { ProjectProvider } from "@/context/ProjectContext";

export default function Home() {
  return (
    <ProjectProvider>
      <SmoothScroll>
        <Navbar />
        <main id="main-content" className="relative bg-background">
          <HeroSection />
          <About />
          <Interactive3D />
          <BuildingExplorer />
          <Gallery />
          <Amenities />
          <Location />
          <Contact />
        </main>
        <Footer />
      </SmoothScroll>
    </ProjectProvider>
  );
}
