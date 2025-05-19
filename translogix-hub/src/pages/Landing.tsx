
import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Truck, Box, BarChart4, 
  Globe, Shield, Smartphone, Clock, 
  RefreshCw, Users, Zap, Check
} from "lucide-react";
import { apply3DTransform } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const Landing = () => {
  const { t, dir } = useLanguage();
  const featuresRef = useRef<HTMLDivElement>(null);
  
  // Animation for features section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (featuresRef.current) {
      const featureElements = featuresRef.current.querySelectorAll('.feature-card');
      featureElements.forEach((el) => observer.observe(el));
    }
    
    return () => {
      if (featuresRef.current) {
        const featureElements = featuresRef.current.querySelectorAll('.feature-card');
        featureElements.forEach((el) => observer.unobserve(el));
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-background" dir={dir}>
      <main className="flex-1">
        {/* Hero Section - Enhanced with 3D elements */}
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/30 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
          </div>
          
          <div className="container max-w-6xl mx-auto py-20 md:py-32 px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Truck className="h-4 w-4 mr-2" />
                  {t('landing.logistics_platform') || "Smart Logistics Platform"}
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  {t('landing.title') || "Transform Your Supply Chain"}
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-md">
                  {t('landing.subtitle') || "Our platform provides real-time tracking, analytics, and optimization for your entire logistics operation."}
                </p>
                
                <div className="pt-4 space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" className="group" asChild>
                      <Link to="/login">
                        {t('landing.get_started') || "Get Started"}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link to="/dashboard">{t('landing.explore') || "Demo Dashboard"}</Link>
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-1 text-accent" />
                      <span>{t('landing.no_credit_card') || "No credit card required"}</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-1 text-accent" />
                      <span>{t('landing.free_trial') || "14-day free trial"}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced 3D Dashboard Preview */}
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl transform -rotate-1"></div>
                <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
                <div className="absolute -left-8 -top-8 w-36 h-36 bg-primary/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 p-2">
                  <div 
                    className="overflow-hidden rounded-xl border shadow-lg bg-card transform transition-all duration-500 hover:shadow-xl"
                    style={apply3DTransform(5, -8, 15)}
                  >
                    <img 
                      src="/placeholder-dashboard.jpg"
                      alt="Logistics Dashboard"
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                      <div className="p-4 text-white w-full">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Enterprise Dashboard</span>
                          <div className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded">PRO</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Second 3D element - Mobile app preview */}
                  <div 
                    className="absolute -bottom-10 -right-16 overflow-hidden rounded-xl border shadow-lg bg-card w-52 transform transition-all duration-500 hover:shadow-xl z-20"
                    style={apply3DTransform(-5, 10, 5)}
                  >
                    <img 
                      src="/placeholder-mobile.jpg"
                      alt="Mobile App"
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                      <div className="p-3 text-white w-full">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Mobile App</span>
                          <div className="px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] rounded">NEW</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-16 border-y border-border/40 bg-muted/30">
          <div className="container max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "99.9%", label: t('landing.stats.uptime') || "Uptime" },
                { value: "10k+", label: t('landing.stats.shipments') || "Daily Shipments" },
                { value: "50+", label: t('landing.stats.countries') || "Countries" },
                { value: "30%", label: t('landing.stats.cost_reduction') || "Avg. Cost Reduction" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features Section - Expanded with more options */}
        <section className="py-20" ref={featuresRef}>
          <div className="container max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">{t('landing.features.title') || "Comprehensive Logistics Solutions"}</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                {t('landing.features.subtitle') || "Our platform offers everything you need for modern logistics management"}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Truck className="h-6 w-6 text-primary" />,
                  title: t('landing.features.tracking') || "Real-time Tracking",
                  description: t('landing.features.tracking_desc') || "Track shipments in real-time with precision GPS. Get immediate notifications for delays or issues."
                },
                {
                  icon: <Box className="h-6 w-6 text-primary" />,
                  title: t('landing.features.inventory') || "Inventory Management",
                  description: t('landing.features.inventory_desc') || "Manage warehouse inventory with barcode scanning, automated reordering, and stock forecasting."
                },
                {
                  icon: <BarChart4 className="h-6 w-6 text-primary" />,
                  title: t('landing.features.analytics') || "Advanced Analytics",
                  description: t('landing.features.analytics_desc') || "Make data-driven decisions with comprehensive analytics, custom reports, and automated insights."
                },
                {
                  icon: <Globe className="h-6 w-6 text-primary" />,
                  title: t('landing.features.global') || "Global Logistics",
                  description: t('landing.features.global_desc') || "Manage international shipping with customs documentation, duty calculations, and compliance tools."
                },
                {
                  icon: <Shield className="h-6 w-6 text-primary" />,
                  title: t('landing.features.security') || "Secure Operations",
                  description: t('landing.features.security_desc') || "Enterprise-grade security with role-based access control, audit trails, and data encryption."
                },
                {
                  icon: <Smartphone className="h-6 w-6 text-primary" />,
                  title: t('landing.features.mobile') || "Mobile App",
                  description: t('landing.features.mobile_desc') || "Manage your logistics on the go with our powerful mobile app for iOS and Android."
                }
              ].map((feature, i) => (
                <Card 
                  key={i} 
                  className="feature-card border-border/40 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:-translate-y-1 opacity-0"
                >
                  <CardContent className="pt-6">
                    <div className="bg-primary/10 p-3 inline-flex rounded-lg mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* How It Works Section - New with 3D illustrations */}
        <section className="py-20 bg-muted/30">
          <div className="container max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">{t('landing.how_it_works.title') || "How It Works"}</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                {t('landing.how_it_works.subtitle') || "Our platform streamlines your logistics operations in four simple steps"}
              </p>
            </div>
            
            <div className="relative">
              {/* Connection lines */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 transform -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {[
                  {
                    icon: <Box className="h-8 w-8 text-white" />,
                    title: t('landing.how_it_works.step1.title') || "Connect",
                    description: t('landing.how_it_works.step1.description') || "Integrate with your existing systems and data sources"
                  },
                  {
                    icon: <RefreshCw className="h-8 w-8 text-white" />,
                    title: t('landing.how_it_works.step2.title') || "Optimize",
                    description: t('landing.how_it_works.step2.description') || "Our AI analyzes your logistics network and suggests improvements"
                  },
                  {
                    icon: <Truck className="h-8 w-8 text-white" />,
                    title: t('landing.how_it_works.step3.title') || "Track",
                    description: t('landing.how_it_works.step3.description') || "Monitor all shipments and inventory in real time"
                  },
                  {
                    icon: <Zap className="h-8 w-8 text-white" />,
                    title: t('landing.how_it_works.step4.title') || "Scale",
                    description: t('landing.how_it_works.step4.description') || "Grow your operations with a platform that scales with you"
                  }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div 
                        className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg relative z-10"
                        style={apply3DTransform(5, 5, 2)}
                      >
                        {step.icon}
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-md z-0"></div>
                      <div className="absolute -bottom-3 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {i + 1}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Use Cases Section - New with images */}
        <section className="py-20">
          <div className="container max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">{t('landing.use_cases.title') || "Built For Every Industry"}</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                {t('landing.use_cases.subtitle') || "Our logistics platform adapts to your industry-specific needs"}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  image: "/placeholder-ecommerce.jpg",
                  title: t('landing.use_cases.ecommerce') || "E-Commerce",
                  description: t('landing.use_cases.ecommerce_desc') || "Optimize fulfillment operations and streamline last-mile delivery"
                },
                {
                  image: "https://images.unsplash.com/photo-1519799478955-1c5b789a6bfb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  title: t('landing.use_cases.manufacturing') || "Manufacturing",
                  description: t('landing.use_cases.manufacturing_desc') || "Manage complex supply chains and just-in-time inventory"
                },
                {
                  image: "/placeholder-healthcare.jpg",
                  title: t('landing.use_cases.healthcare') || "Healthcare",
                  description: t('landing.use_cases.healthcare_desc') || "Ensure compliance and optimize medical supply logistics"
                },
                {
                  image: "/placeholder-retail.jpg",
                  title: t('landing.use_cases.retail') || "Retail",
                  description: t('landing.use_cases.retail_desc') || "Synchronize in-store and online inventory management"
                },
                {
                  image: "/placeholder-food.jpg",
                  title: t('landing.use_cases.food') || "Food & Beverage",
                  description: t('landing.use_cases.food_desc') || "Handle perishable goods with temperature-controlled tracking"
                },
                {
                  image: "/placeholder-construction.jpg",
                  title: t('landing.use_cases.construction') || "Construction",
                  description: t('landing.use_cases.construction_desc') || "Coordinate materials delivery and equipment logistics"
                }
              ].map((useCase, i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-md">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={useCase.image} 
                      alt={useCase.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                    <p className="text-muted-foreground">{useCase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials Section - Enhanced with logos */}
        <section className="py-20 bg-muted/30">
          <div className="container max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">{t('landing.testimonials.title') || "Trusted By Industry Leaders"}</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                {t('landing.testimonials.subtitle') || "See what our customers have to say about our platform"}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  quote: t('landing.testimonials.quote1') || "LogiTrac has transformed how we manage our supply chain. The platform is intuitive and has increased our operational efficiency by 35%.",
                  author: t('landing.testimonials.author1') || "Sarah Johnson",
                  title: t('landing.testimonials.title1') || "Operations Director, Global Shipping Co.",
                  image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                },
                {
                  quote: t('landing.testimonials.quote2') || "We've reduced shipping errors by 42% and cut delivery times in half. The ROI on this platform has been exceptional.",
                  author: t('landing.testimonials.author2') || "Michael Chen",
                  title: t('landing.testimonials.title2') || "CEO, FastTrack Logistics",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                },
              ].map((testimonial, i) => (
                <Card 
                  key={i} 
                  className="border border-border/40 shadow-sm overflow-hidden"
                  style={apply3DTransform(1, -1, 5)}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 rounded-full p-1 flex-shrink-0">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.author}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-primary opacity-20 mb-2 h-8 w-8">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16.5v-7m4 7V9.5m4 7V4.5" />
                        </svg>
                        <blockquote className="text-lg font-medium mb-4">
                          "{testimonial.quote}"
                        </blockquote>
                        <div>
                          <div className="font-semibold">{testimonial.author}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Logos */}
            <div className="mt-16">
              <p className="text-center text-sm text-muted-foreground mb-8">
                {t('landing.trusted_by') || "TRUSTED BY COMPANIES WORLDWIDE"}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
                {/* Replace with actual company logos */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 flex items-center justify-center opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                    <div className="bg-muted h-6 w-24 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
          <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-32 -top-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          
          <div className="container max-w-5xl mx-auto px-6 relative z-10">
            <div className="bg-card border border-border/60 rounded-2xl p-8 md:p-12 shadow-xl" style={apply3DTransform(1, -1, 10)}>
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">
                  {t('landing.cta.title') || "Ready to Transform Your Logistics?"}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {t('landing.cta.subtitle') || "Join thousands of companies optimizing their supply chain with our platform"}
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Button size="lg" className="group" asChild>
                    <Link to="/login">
                      {t('landing.cta.get_started') || "Get Started Now"}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="#">
                      {t('landing.cta.contact_sales') || "Contact Sales"}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer - Expanded with more links */}
      <footer className="bg-muted/30 py-10 border-t">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.product') || "Product"}</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.features') || "Features"}</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.pricing') || "Pricing"}</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.integrations') || "Integrations"}</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.api') || "API"}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.company') || "Company"}</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.about') || "About Us"}</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.careers') || "Careers"}</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.blog') || "Blog"}</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.press') || "Press"}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.resources') || "Resources"}</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.documentation') || "Documentation"}</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.guides') || "Guides"}</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.webinars') || "Webinars"}</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.support') || "Support"}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.legal') || "Legal"}</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.privacy') || "Privacy"}</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.terms') || "Terms"}</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.security') || "Security"}</Link></li>
                <li><Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('landing.footer.cookies') || "Cookies"}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} LogiTrac. {t('landing.footer.rights') || "All rights reserved."}
            </p>
            <div className="flex space-x-6">
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                  <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z" />
                </svg>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
