import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, Code, Globe, MessageCircle, DollarSign } from 'lucide-react'

const features = [
    {
        icon: <Code className="h-6 w-6" />,
        title: "Easy Contest Creation",
        description: "Create coding challenges with clear requirements, deadlines, and SOL rewards in minutes."
    },
    {
        icon: <DollarSign className="h-6 w-6" />,
        title: "Earn SOL for Your Skills",
        description: "Compete in challenges, submit solutions, and earn SOL rewards for your coding expertise."
    },
    {
        icon: <Wallet className="h-6 w-6" />,
        title: "Built-in Solana Wallet",
        description: "Seamlessly manage your SOL earnings with our integrated Solana wallet."
    },
    {
        icon: <MessageCircle className="h-6 w-6" />,
        title: "Direct Communication",
        description: "Discuss projects with hosts and developers in dedicated discussion sections."
    },
    {
        icon: <Globe className="h-6 w-6" />,
        title: "Global Developer Network",
        description: "Access a worldwide community of skilled developers ready to tackle challenging projects."
    }
]

export default function FeatureSection() {
    return (
        <Card className="py-12 rounded-md bg-background border-border">
            <div className="container mx-auto px-4">
                <CardTitle className="text-3xl font-bold text-center mb-12">Platform Features</CardTitle>
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-secondary p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-secondary-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}