"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Description, Field, Label, Textarea } from "@headlessui/react"
import { Languages, Brain, Copy, Volume2, VolumeX } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import clsx from "clsx"

interface LiveTranslationDisplayProps {
  translationText: string
  summaryText: string
  sourceLanguage: string
  targetLanguage: string
  isProcessing: boolean
}

export default function LiveTranslationDisplay({
  translationText,
  summaryText,
  sourceLanguage,
  targetLanguage,
  isProcessing,
}: LiveTranslationDisplayProps) {
  const [isTranslationSpeaking, setIsTranslationSpeaking] = useState(false)
  const [isSummarySpeaking, setIsSummarySpeaking] = useState(false)

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${type} has been copied to your clipboard.`,
    })
  }

  const handleSpeak = (text: string, type: "translation" | "summary") => {
    if ("speechSynthesis" in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel()

      if (type === "translation" && isTranslationSpeaking) {
        setIsTranslationSpeaking(false)
        return
      }

      if (type === "summary" && isSummarySpeaking) {
        setIsSummarySpeaking(false)
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = type === "translation" ? targetLanguage : "en"

      utterance.onstart = () => {
        if (type === "translation") setIsTranslationSpeaking(true)
        if (type === "summary") setIsSummarySpeaking(true)
      }

      utterance.onend = () => {
        if (type === "translation") setIsTranslationSpeaking(false)
        if (type === "summary") setIsSummarySpeaking(false)
      }

      utterance.onerror = () => {
        if (type === "translation") setIsTranslationSpeaking(false)
        if (type === "summary") setIsSummarySpeaking(false)
      }

      window.speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    return () => {
      // Cleanup speech synthesis on unmount
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Live Translation Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-blue-900">Live Translation</CardTitle>
              {isProcessing && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 animate-pulse">
                  Processing...
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSpeak(translationText, "translation")}
                disabled={!translationText || isProcessing}
                className="border-blue-200 hover:bg-blue-50"
              >
                {isTranslationSpeaking ? (
                  <VolumeX className="w-4 h-4 text-blue-600" />
                ) : (
                  <Volume2 className="w-4 h-4 text-blue-600" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(translationText, "Translation")}
                disabled={!translationText || isProcessing}
                className="border-blue-200 hover:bg-blue-50"
              >
                <Copy className="w-4 h-4 text-blue-600" />
              </Button>
            </div>
          </div>
          <CardDescription className="text-blue-700">
            Real-time translation from {sourceLanguage.toUpperCase()} to {targetLanguage.toUpperCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <Label className="text-sm/6 font-medium text-blue-900">Translated Content</Label>
            <Description className="text-sm/6 text-blue-700/70">
              Live translation appears here as the audio is processed
            </Description>
            <Textarea
              value={
                translationText || (isProcessing ? "Processing translation..." : "Translation will appear here...")
              }
              readOnly
              className={clsx(
                "mt-3 block w-full resize-none rounded-lg border-none bg-white/60 px-4 py-3 text-sm/6 text-blue-900",
                "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-blue-500/25",
                "placeholder:text-blue-500/50 backdrop-blur-sm",
              )}
              rows={8}
              placeholder={isProcessing ? "Processing translation..." : "Translation will appear here..."}
            />
          </Field>
        </CardContent>
      </Card>

      {/* AI Summary Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-purple-900">AI Summary</CardTitle>
              {isProcessing && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 animate-pulse">
                  Analyzing...
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSpeak(summaryText, "summary")}
                disabled={!summaryText || isProcessing}
                className="border-purple-200 hover:bg-purple-50"
              >
                {isSummarySpeaking ? (
                  <VolumeX className="w-4 h-4 text-purple-600" />
                ) : (
                  <Volume2 className="w-4 h-4 text-purple-600" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(summaryText, "AI Summary")}
                disabled={!summaryText || isProcessing}
                className="border-purple-200 hover:bg-purple-50"
              >
                <Copy className="w-4 h-4 text-purple-600" />
              </Button>
            </div>
          </div>
          <CardDescription className="text-purple-700">
            Intelligent analysis and key insights from the meeting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <Label className="text-sm/6 font-medium text-purple-900">Meeting Insights</Label>
            <Description className="text-sm/6 text-purple-700/70">
              AI-powered summary with key points and action items
            </Description>
            <Textarea
              value={summaryText || (isProcessing ? "Generating AI insights..." : "AI summary will appear here...")}
              readOnly
              className={clsx(
                "mt-3 block w-full resize-none rounded-lg border-none bg-white/60 px-4 py-3 text-sm/6 text-purple-900",
                "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-purple-500/25",
                "placeholder:text-purple-500/50 backdrop-blur-sm",
              )}
              rows={8}
              placeholder={isProcessing ? "Generating AI insights..." : "AI summary will appear here..."}
            />
          </Field>
        </CardContent>
      </Card>
    </div>
  )
}
