'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardTitle } from "@/components/ui/card";

const faqs = [
    {
        question: "How do I create a coding contest?",
        answer: "To create a coding contest, log in to your account, click on 'Create Contest', fill in the details including requirements, deadline, and SOL reward. Once you've reviewed everything, click 'Publish' to make your contest live."
    },
    {
        question: "How are SOL rewards distributed?",
        answer: "When a contest host selects a winner, the SOL reward is automatically transferred from the contest's escrow to the winner's integrated Solana wallet. This process is secure and instantaneous."
    },
    {
        question: "Can I participate in multiple contests simultaneously?",
        answer: "Yes, you can participate in as many contests as you like. Just make sure you can meet all the deadlines before committing to multiple projects."
    },
    {
        question: "How does the discussion feature work?",
        answer: "Each contest has a dedicated discussion section where participants can ask questions and the host can provide clarifications. All registered participants and the host can view and contribute to these discussions."
    },
    {
        question: "What happens if no submission meets the contest requirements?",
        answer: "If no submission meets the requirements, the host can choose to extend the deadline, modify the contest, or cancel it. If cancelled, the SOL reward is returned to the host's wallet."
    }
]

function AccordionItem({ question, answer, isOpen, onToggle }) {
    return (
        <div className="border-b border-gray-200">
            <button
                className="flex justify-between items-center w-full py-5 text-left"
                onClick={onToggle}
            >
                <span className="text-lg font-medium">{question}</span>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 " />
                ) : (
                    <ChevronDown className="h-5 w-5 " />
                )}
            </button>
            {isOpen && (
                <div className="pb-5 pr-12">
                    <p className="text-muted-foreground">{answer}</p>
                </div>
            )}
        </div>
    )
}

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null)

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <Card className="w-full  py-12">
            <div className="container mx-auto px-4">
                <CardTitle className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</CardTitle>
                <div className=" mx-auto ">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onToggle={() => handleToggle(index)}
                        />
                    ))}
                </div>
            </div>
        </Card>
    )
}