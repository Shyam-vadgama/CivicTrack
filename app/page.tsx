import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, FileText, Users, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Civic Engagement Platform
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-blue-600">CivicTrack</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Your voice matters. Report civic issues, track their progress, and help build a better community together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-lg px-8">
              <Link href="/public-complaints">View Public Complaints</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <p className="text-gray-600 dark:text-gray-300">Complaints Resolved</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
              <p className="text-gray-600 dark:text-gray-300">Active Citizens</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <p className="text-gray-600 dark:text-gray-300">Partner Cities</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
              <p className="text-gray-600 dark:text-gray-300">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How CivicTrack Works</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Simple steps to make your community better
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Report Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Submit complaints about roads, drainage, streetlights, and other civic issues with photos and location
                details.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor the status of your complaints in real-time as they move from pending to in-progress to resolved.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>See Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get updates and see your issues resolved by local authorities with transparent communication.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Platform Features</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Fast Reporting</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Quick and easy complaint submission</p>
            </div>
            <div className="text-center">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Photo Upload</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Add images to support your complaints</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Efficient complaint management system</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Real-time Updates</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Stay informed about complaint status</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Citizens Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="ml-3">
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Downtown Resident</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "CivicTrack made it so easy to report the broken streetlight on my street. It was fixed within a week!"
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div className="ml-3">
                  <p className="font-semibold">Mike Chen</p>
                  <p className="text-sm text-gray-500">Business Owner</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The transparency in tracking complaint resolution has improved our community engagement significantly."
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div className="ml-3">
                  <p className="font-semibold">Anna Rodriguez</p>
                  <p className="text-sm text-gray-500">Community Leader</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "As a community leader, CivicTrack helps me stay informed about local issues and their resolution
                status."
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of citizens working together to improve their communities.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/register">Start Reporting Issues</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
