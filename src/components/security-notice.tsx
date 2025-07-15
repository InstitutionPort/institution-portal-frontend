import { Shield } from "lucide-react";


type SecurityNoticeProps = {
  title?: string,
  description: string
}
export default function SecurityNotice({
  title = "Security Notice",
  description
}: SecurityNoticeProps) {
  return <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex items-start gap-2">
      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
      <div className="text-sm">
        <p className="font-medium text-blue-800">{title}</p>
        <p className="text-blue-700 mt-1">
          {description}{" "}
        </p>
      </div>
    </div>
  </div>
}