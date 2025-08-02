import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, FileText, Users, Zap, ArrowRight, Star, MapPin, Clock, Shield, Smartphone } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 overflow-x-hidden">
      {/* Floating elements for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-green-200/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 border-0 text-blue-700 dark:text-blue-300 font-medium">
            🏛️ Civic Engagement Platform
          </Badge>
          
          <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-8 leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CivicTrack
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Your voice matters. Report civic issues, track their progress, and help build a better community together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Link href="/register" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-10 py-4 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-lg px-8 py-4 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300">
              <Link href="/public-complaints">View Public Complaints</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>50+ Cities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section with enhanced styling */}
      <section className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-20 border-y border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">10,000+</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Complaints Resolved</p>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">5,000+</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Active Citizens</p>
              <div className="w-12 h-1 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">50+</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Partner Cities</p>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-violet-600 mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">95%</div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Satisfaction Rate</p>
              <div className="w-12 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto mt-2 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section with enhanced cards */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">Process</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">How CivicTrack Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Simple steps to make your community better
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20">
            <CardHeader className="text-center pb-4">
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
              </div>
              <CardTitle className="text-xl">Report Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Submit complaints about roads, drainage, streetlights, and other civic issues with photos and location details.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800 dark:to-green-900/20">
            <CardHeader className="text-center pb-4">
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
              </div>
              <CardTitle className="text-xl">Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Monitor the status of your complaints in real-time as they move from pending to in-progress to resolved.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-900/20">
            <CardHeader className="text-center pb-4">
              <div className="relative mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
              </div>
              <CardTitle className="text-xl">See Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Get updates and see your issues resolved by local authorities with transparent communication.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section with grid layout */}
      <section className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-2">Features</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">Platform Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need for effective civic engagement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="group text-center p-6 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Fast Reporting</h3>
              <p className="text-gray-600 dark:text-gray-300">Quick and easy complaint submission</p>
            </div>

            <div className="group text-center p-6 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Photo Upload</h3>
              <p className="text-gray-600 dark:text-gray-300">Add images to support your complaints</p>
            </div>

            <div className="group text-center p-6 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Admin Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-300">Efficient complaint management system</p>
            </div>

            <div className="group text-center p-6 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Real-time Updates</h3>
              <p className="text-gray-600 dark:text-gray-300">Stay informed about complaint status</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">Testimonials</Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">What Citizens Say</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Real stories from real people making a difference
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  S
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-lg">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Downtown Resident</p>
                </div>
                <div className="ml-auto flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                "CivicTrack made it so easy to report the broken streetlight on my street. It was fixed within a week!"
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-green-900/10">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  M
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-lg">Mike Chen</p>
                  <p className="text-sm text-gray-500">Business Owner</p>
                </div>
                <div className="ml-auto flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                "The transparency in tracking complaint resolution has improved our community engagement significantly."
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/10">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  A
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-lg">Anna Rodriguez</p>
                  <p className="text-sm text-gray-500">Community Leader</p>
                </div>
                <div className="ml-auto flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                "As a community leader, CivicTrack helps me stay informed about local issues and their resolution status."
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl lg:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join thousands of citizens working together to improve their communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-10 py-4 bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Link href="/register" className="flex items-center gap-2">
                  Start Reporting Issues
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-10 py-4 border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                <Link href="/public-complaints">View Public Issues</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}