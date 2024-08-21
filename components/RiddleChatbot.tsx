'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, ThumbsUp } from 'lucide-react'

// Simulated function to generate a riddle
const generateRiddle = () => {
  const riddles = [
    "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    "You measure my life in hours and I serve you by expiring. I'm quick when I'm thin and slow when I'm fat. The wind is my enemy. What am I?",
    "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
  ]
  return riddles[Math.floor(Math.random() * riddles.length)]
}

// Simulated function to save riddle to database
const saveRiddleToDatabase = async (riddle: string, difficulty: number) => {
  // In a real application, this would be an API call to your backend
  console.log(`Saving riddle to database: ${riddle} with difficulty ${difficulty}`)
  // Simulating an async operation
  await new Promise(resolve => setTimeout(resolve, 500))
  return { success: true }
}

type Message = {
  id: number
  text: string
  sender: 'user' | 'bot'
  rating?: number
}

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [currentRiddle, setCurrentRiddle] = useState<string | null>(null)

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newUserMessage: Message = { id: Date.now(), text: input, sender: 'user' }
      setMessages(prev => [...prev, newUserMessage])
      setInput('')

      // Generate and send a riddle
      const riddle = generateRiddle()
      setCurrentRiddle(riddle)
      const newBotMessage: Message = { id: Date.now() + 1, text: riddle, sender: 'bot' }
      setMessages(prev => [...prev, newBotMessage])
    }
  }

  const handleRateRiddle = async (difficulty: number) => {
    if (currentRiddle) {
      // Save the riddle and its rating to the database
      const result = await saveRiddleToDatabase(currentRiddle, difficulty)
      if (result.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.text === currentRiddle ? { ...msg, rating: difficulty } : msg
          )
        )
        setCurrentRiddle(null)
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Riddle Chatbot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {message.text}
              </div>
              {message.sender === 'bot' && !message.rating && (
                <div className="mt-2">
                  <Label htmlFor={`rating-${message.id}`} className="text-sm font-medium">
                    Rate difficulty:
                  </Label>
                  <RadioGroup
                    id={`rating-${message.id}`}
                    className="flex space-x-2 mt-1"
                    onValueChange={(value) => handleRateRiddle(parseInt(value))}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex items-center space-x-1">
                        <RadioGroupItem value={value.toString()} id={`r${message.id}-${value}`} />
                        <Label htmlFor={`r${message.id}-${value}`}>{value}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
              {message.rating && (
                <div className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" /> Rated: {message.rating}/5
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message-input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}