
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Loader2, CheckCircle } from "lucide-react"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { useGetUserBackup } from "@/lib/queries/use-settings"
// import { useAccountBackup } from "@/lib/queries/use-account-backup"

export function AccountBackup() {
  const [lastBackup, setLastBackup] = useState<string | null>(null)
  const userBackupMuation = useGetUserBackup()

  const handleDownload = async () => {
    const data = await userBackupMuation.mutateAsync(undefined)
    if (!data || !data.data) return toast.error("No backup data found to download.")

    try {
      const blob = new Blob([JSON.stringify(data.data, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `institution-port-account-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Backup downloaded successfully.")
      setLastBackup(new Date().toISOString())
    } catch {
      toast.error("Failed to download backup.")
    }

  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Download className="h-5 w-5" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Account Data Backup</p>
              </TooltipContent>
            </Tooltip >
            Account Backup
          </CardTitle >
          <CardDescription>Download all your account data securely</CardDescription>
        </CardHeader >

        <CardContent className="space-y-6">
          {lastBackup && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">Backup downloaded</p>
                <p className="text-xs text-green-600">{formatDate(lastBackup)}</p>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-2 border-t">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Export Format</h4>
              <p className="text-xs text-muted-foreground">
                Your account data will be exported as a readable JSON file.
              </p>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleDownload}
                  disabled={userBackupMuation.isPending}
                  className="w-full flex items-center gap-2"
                >
                  {userBackupMuation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Fetching Backup...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Generate & Download Backup
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Securely download your full account backup</p>
              </TooltipContent>
            </Tooltip>

            <p className="text-xs text-muted-foreground text-center">
              Keep this file secure and private. Do not share it.
            </p>
          </div>
        </CardContent>
      </Card >
    </TooltipProvider >

  )
}
