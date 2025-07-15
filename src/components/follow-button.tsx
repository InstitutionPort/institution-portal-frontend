"use client"

import { Check, CirclePlus, Heart, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFollow } from "@/lib/queries/use-follow"
import { ExploreFilters } from "../app/explore/explore-content"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface FollowButtonProps {
  classNames?: string
  variant?: "outline" | "link" | "ghost",
  idToFollow: string
  isFollowing: boolean
  queryKey: [string, any]
}

export default function FollowButton({ classNames, variant = "outline", idToFollow, isFollowing, queryKey }: FollowButtonProps) {
  // const queryClient = useQueryClient()
  const followMutation = useFollow("POST")
  const unfollowMutation = useFollow("DELETE")

  const handleToggleFollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate({ followId: idToFollow, follow: false, key: queryKey })
    } else {
      followMutation.mutate({ followId: idToFollow, follow: true, key: queryKey })
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className={classNames} variant={variant} size="sm" onClick={(e) => {
            e.preventDefault();
            handleToggleFollow()
          }}>
            {isFollowing ? <Check /> : <CirclePlus />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{isFollowing ? "Unfollow" : "Follow"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
