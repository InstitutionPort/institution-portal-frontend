import { Calendar, CalendarIcon, Camera, Check, CircleX, Edit3, Loader2, PencilLine, RefreshCcw, SaveIcon, Settings, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ControlledInput } from "../../components/ controlled-form-components/controlled-input";
import SelectLocation from "../../components/select-location";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { useUpdateUserPrivateData, useUserPrivateInfo } from "@/lib/queries/use-settings";
import { useForm } from "react-hook-form";
import { userBasicInfoSchema, userBasicInfoSchemaType } from "@/lib/validation/settings-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledCalendar } from "../../components/ controlled-form-components/controlled-calander";
import { Form } from "../../components/ui/form";
import { ErrorBox } from "@/components/error-box";
import { LoadingBox } from "@/components/loading-box";
import { SUCCESS_API_RESPONSE, SUCCESS_RESPONSE } from "@/utils/types";
import { toast } from "sonner";
import { useMutationCustom } from "@/lib/queries/use-muation-custom";
import { useQueryClient } from "@tanstack/react-query";

export default function BasicInfo(props: { username: string }) {

  const { data: userBasicInfoResposne, isPending: userPending, error: userError, refetch: refetchUser } = useUserPrivateInfo(props.username, 'basic-info')
  const userBasicInfo = userBasicInfoResposne?.data as any
  const updatePersonalInfoMutation = useUpdateUserPrivateData<userBasicInfoSchemaType>(props.username, 'basic-info')
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()
  // const [avatarPreview, setAvatarPreview] = useState<string>(userBasicInfo?.avatarUrl ?? "")
  const avatarMutation = useMutationCustom({
    apiRoute: "/api/settings/avatar-upload",
    key: ["settings/avatar-upload"],
    method: "POST",
    httpOnlyCookie: true,
    errorFallbackMsg: "Avatar upload failed.",
    successFallbackMsg: "Avatar uploaded successfully.",
    onSuccessSideEffect: (success: SUCCESS_RESPONSE) => {
      form.setValue("avatarUrl", success.data?.avatarUrl)
      // await queryClient.invalidateQueries({ queryKey: ['/api/settings/activity-info'] })
      //lets not do this since it can mess up the form state

    }
    ,
    onErrorSideEffect: (err, vars, context) => {
      form.setValue("avatarUrl", "")
    }
  })



  const form = useForm<userBasicInfoSchemaType>({
    resolver: zodResolver(userBasicInfoSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      username: "",
      nation: "",
      city: "",
      dateOfBirth: "",
      avatarUrl: "",
    },
  })

  useEffect(() => {
    if (userBasicInfo) {
      form.reset({
        firstName: userBasicInfo.firstName || "",
        middleName: userBasicInfo.middleName || "",
        lastName: userBasicInfo.lastName || "",
        username: userBasicInfo.username || "",
        city: userBasicInfo.city || "",
        nation: userBasicInfo.nation || "",
        dateOfBirth: userBasicInfo.dateOfBirth || "",
        avatarUrl: userBasicInfo.avatarUrl || "",
      })
    }
  }, [userBasicInfo, form])

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form
      if (userBasicInfo) {
        form.reset({
          firstName: userBasicInfo.firstName || "",
          middleName: userBasicInfo.middleName || "",
          lastName: userBasicInfo.lastName || "",
          username: userBasicInfo.username || "",
          nation: userBasicInfo.nation || "",
          city: userBasicInfo.city || "",
          dateOfBirth: userBasicInfo.dateOfBirth || "",
          avatarUrl: userBasicInfo.avatarUrl || "",
        })
        // setAvatarPreview(userBasicInfo.avatarUrl || "")
      }
    }
    setIsEditing(!isEditing)
  }

  const handleSave = async (data: userBasicInfoSchemaType) => {
    updatePersonalInfoMutation.mutateAsync({
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      username: data.username,
      city: data.city,
      nation: data.nation,
      dateOfBirth: data.dateOfBirth,
      avatarUrl: data.avatarUrl,
    })
    setIsEditing(false)

  }



  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Instant feedback, optiistic update
      form.setValue("avatarUrl", URL.createObjectURL(file))
      const formData = new FormData()
      formData.append("avatar", file)
      avatarMutation.mutate(formData)
    }
  }







  return <Form {...form}><Card>
    <CardHeader className="relative">
      <CardTitle className="flex items-center gap-2">
        <User className="h-5 w-5" />
        Personal Information
      </CardTitle>
      <CardDescription>Your basic personal details</CardDescription>
      {userBasicInfoResposne && <Button
        onClick={handleEditToggle}
        variant={isEditing ? "default" : "outline"}
        size="sm"
        className="absolute top-3 right-2 text-sm flex items-center gap-2"
      >
        {isEditing ? <><CircleX className="h-3 w-3" />Cancel</> : (<><PencilLine className="h-4 w-4" />Edit</>)}
      </Button>
      }
    </CardHeader>
    <CardContent className="space-y-6">
      {userPending ? (
        <LoadingBox title="Loading Personal Info..." message="Please wait while we get your data." />
      ) : userError ? (
        <ErrorBox
          title="Failed to Load Data"
          message={userError?.message ?? "Something went wrong."}
          onRetry={() => refetchUser()}
        />
      ) : !userBasicInfoResposne ? (
        <ErrorBox
          title="No Data"
          message="We couldn't find your account info."
          onRetry={() => (refetchUser as any)()}
        />
      ) : (<>
        {/* Avatar and Profile Header */}
        <div className="flex flex-col items-center space-y-4 pb-6 border-b">
          <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-primary shadow-sm">
            <Avatar className="w-full h-full flex items-center bg-primary justify-center">
              <AvatarImage
                src={form && form.watch("avatarUrl")}
                className="w-full h-full object-cover"
                alt="Profile Picture"
              />
              <AvatarFallback className="text-xl font-bold text-center text-primary-foreground">
                {userBasicInfo.firstName?.[0].toUpperCase()}
                {userBasicInfo.lastName?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </>
            )}

          </div>

          <div className="text-center space-y-1">
            <h3 className="text-xl font-semibold">@{userBasicInfo?.username}</h3>
            <p className="text-sm text-muted-foreground">
              {userBasicInfo?.firstName} {userBasicInfo?.lastName}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ControlledInput form={form} name="firstName"
            id="firstName" label="First Name *" disabled={!isEditing}
            classNameInput={!isEditing ? "bg-muted" : ""}
          />
          <ControlledInput form={form} name="middleName"
            id="middleName" label="Middle Name" disabled={!isEditing}
            classNameInput={!isEditing ? "bg-muted" : ""}
          />
          <ControlledInput form={form} name="lastName"
            id="lastName" label="Last Name *" disabled={!isEditing}
            classNameInput={!isEditing ? "bg-muted" : ""}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ControlledInput form={form} name="username"
            id="username" label="Username *" disabled={!isEditing}
            classNameInput={!isEditing ? "bg-muted" : ""}
          />
          <ControlledCalendar
            hidden={{
              before: new Date("1900-01-01"),
              after: new Date()
              //  after:new Date().setFullYear(new Date().getFullYear() - 3) }}
            }}
            form={form}
            name="dateOfBirth"
            label="Date of Birth"
            disabled={!isEditing}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectLocation
            nation={form.getValues("nation")}
            city={form.getValues("city")}
            nationLabel="Nation *"
            cityLabel="City *"
            form={{ nationName: "nation", cityName: "city", formEle: form }}
            disabled={!isEditing}
          />
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <Button
              onClick={form.handleSubmit(handleSave)}
              disabled={updatePersonalInfoMutation.isPending}
              size="sm"
              className="flex items-center gap-2 text-sm"
            >
              {updatePersonalInfoMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        )}
      </>)}
    </CardContent>
  </Card>
  </Form >
}