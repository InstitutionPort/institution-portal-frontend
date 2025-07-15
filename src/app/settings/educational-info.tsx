import { Check, CircleX, GraduationCap, Loader2, PencilLine, RefreshCcw, } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { ControlledInput } from "../../components/ controlled-form-components/controlled-input";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { useUpdateUserPrivateData, useUserPrivateInfo } from "@/lib/queries/use-settings";
import { useForm } from "react-hook-form";
import { userEducationalInfoSchema, userEducationalInfoSchemaType } from "@/lib/validation/settings-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge"
import SingleSelectDropdown from "../../components/single-select-dropdown";
import { Form } from "../../components/ui/form";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "../../components/ui/tooltip";
import { LoadingBox } from "@/components/loading-box";
import { ErrorBox } from "@/components/error-box";

export default function EducationalInfo(props: { username: string }) {

  const { data: userEducationalInfoResposne, isPending: userPending, error: userError, refetch: refetchUser } = useUserPrivateInfo(props.username, 'educational-info')
  const userEducationalInfo = userEducationalInfoResposne?.data as any
  const updateEducationalInfoMutation = useUpdateUserPrivateData<userEducationalInfoSchemaType>(props.username, 'educational-info')
  const [isEditing, setIsEditing] = useState(false)
  const currentYear = new Date().getFullYear()



  const form = useForm<userEducationalInfoSchemaType>({
    resolver: zodResolver(userEducationalInfoSchema),
    defaultValues: {
      level: "",
      institution: "",
      fieldOfStudy: "",
      graduationYear: "",
      degree: ""
    },
  })

  useEffect(() => {
    if (userEducationalInfo) {
      form.reset({
        level: userEducationalInfo.level || "",
        institution: userEducationalInfo.institution || "",
        fieldOfStudy: userEducationalInfo.fieldOfStudy || "",
        graduationYear: userEducationalInfo.graduationYear || "",
        degree: userEducationalInfo.degree || "",
      })
    }
  }, [userEducationalInfo, form])

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form
      if (userEducationalInfo) {
        form.reset({
          level: userEducationalInfo.level || "",
          institution: userEducationalInfo.institution || "",
          fieldOfStudy: userEducationalInfo.fieldOfStudy || "",
          graduationYear: userEducationalInfo.graduationYear || "",
          degree: userEducationalInfo.degree || "",
        })
      }
    }
    setIsEditing(!isEditing)
  }

  const handleSave = async (data: userEducationalInfoSchemaType) => {
    updateEducationalInfoMutation.mutateAsync({
      level: data.level,
      institution: data.institution,
      fieldOfStudy: data.fieldOfStudy,
      graduationYear: data.graduationYear,
      degree: data.degree,
    })
    setIsEditing(false)
  }









  return <Form {...form}><Card>
    <CardHeader className="relative">
      <CardTitle className="flex items-center gap-2">
        <GraduationCap className="h-5 w-5" />
        Educational Details
        <Badge variant="secondary" className="ml-2">
          Optional
        </Badge>
      </CardTitle>
      <CardDescription>Educational information for fast form fill-ups</CardDescription>
      {userEducationalInfoResposne && <Button
        onClick={handleEditToggle}
        variant={isEditing ? "default" : "outline"}
        size="sm"
        className="absolute top-3 right-2 text-sm flex items-center gap-2"
      >
        {isEditing ? <><CircleX className="h-3 w-3" />Cancel</> : (<><PencilLine className="h-4 w-4" />Edit</>)}
      </Button>}
    </CardHeader>
    <CardContent className="space-y-4">
      {userPending ? (
        <LoadingBox title="Loading Personal Info..." message="Please wait while we get your data." />
      ) : userError ? (
        <ErrorBox
          title="Failed to Load Data"
          message={userError?.message ?? "Something went wrong."}
          onRetry={() => refetchUser()}
        />
      ) : !userEducationalInfoResposne ? (
        <ErrorBox
          title="No Data"
          message="We couldn't find your account info."
          onRetry={() => (refetchUser as any)()}
        />
      ) : (<>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SingleSelectDropdown
            label="Education Level"
            form={{ name: "level", formEle: form }}
            value={form.watch("level")}
            options={userEducationalInfoResposne?.metaData?.educationLevelOptions ?? []}
            onChange={(value) => form.setValue("level", value)}
            disabled={!isEditing}
            placeholder="Select education level"
            classNameInput={!isEditing ? "bg-muted" : ""}
            id="educationLevel"
            loading={userPending}
            error={!!userError}
          />
          <ControlledInput form={form} name="institution"
            id="institution"
            placeholder="University/School name" label="Institution"
            disabled={!isEditing}
            classNameInput={!isEditing ? "bg-muted" : ""}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ControlledInput form={form} name="fieldOfStudy"
            id="fieldOfStudy"
            placeholder="e.g., Computer Science" label="Field of Study"
            disabled={!isEditing}
            classNameInput={!isEditing ? "bg-muted" : ""}
          />
          <ControlledInput form={form} name="degree"
            id="degree"
            placeholder="e.g., Bachelor's, Master's" label="Degree"
            disabled={!isEditing}
            classNameInput={!isEditing ? "bg-muted" : ""}
          />
          <SingleSelectDropdown
            label="Graduation Year"
            form={{ name: "graduationYear", formEle: form }}
            value={form.watch("graduationYear")}
            options={Array.from({ length: 101 }, (_, i) => String(currentYear - i))}
            onChange={(value) => form.setValue("graduationYear", value)}
            disabled={!isEditing}
            placeholder="e.g., 2020"
            classNameInput={!isEditing ? "bg-muted" : ""}
            id="graduationYear"
            loading={userPending}
            error={!!userError}
          />

        </div>

        {isEditing && (
          <div className="flex justify-end">
            <Button
              onClick={form.handleSubmit(handleSave)}
              disabled={updateEducationalInfoMutation.isPending}
              size="sm"
              className="flex items-center gap-2 text-sm"
            >
              {updateEducationalInfoMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        )}</>)
      }
    </CardContent>
  </Card>
  </Form >
}