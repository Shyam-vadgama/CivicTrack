import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Target, Users, Zap, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">About CivicTrack</h1>
              <p className="text-gray-600 dark:text-gray-300">Learn more about our mission and platform</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Mission Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              CivicTrack empowers citizens to actively participate in improving their communities by providing a
              transparent, efficient platform for reporting and tracking civic issues.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We believe in open communication between citizens and local authorities, providing clear visibility
                  into complaint resolution processes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Building stronger communities through collective action and shared responsibility for civic
                  improvement.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Streamlining the complaint process to ensure faster resolution and better resource allocation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Accountability</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Promoting accountability in public service delivery through systematic tracking and reporting.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How CivicTrack Works</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Report Issues</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Citizens submit detailed complaints about civic issues with photos, location, and description through
                  our user-friendly platform.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Admin Review</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Local authorities receive notifications and can review, prioritize, and assign complaints to
                  appropriate departments for resolution.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Both citizens and administrators can track complaint status in real-time, from submission to
                  resolution with transparent updates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Platform Features</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">For Citizens</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Easy complaint submission with photo upload</li>
                  <li>• Real-time status tracking</li>
                  <li>• Personal dashboard to manage all complaints</li>
                  <li>• Mobile-responsive design</li>
                  <li>• Email notifications for updates</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">For Administrators</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Comprehensive admin dashboard</li>
                  <li>• Complaint filtering and sorting</li>
                  <li>• Status update capabilities</li>
                  <li>• Analytics and reporting tools</li>
                  <li>• Bulk operations support</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Join the movement to make your community better. Start reporting issues and tracking their resolution
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/register">Create Account</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
