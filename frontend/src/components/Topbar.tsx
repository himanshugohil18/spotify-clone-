import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import SubscriptionForm from "./SubscriptionForm";

const Topbar = () => {
	const { isAdmin } = useAuthStore();
	const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

	return (
		<>
			<div
				className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 
      backdrop-blur-md z-10
    '
			>
				<div className='flex gap-2 items-center'>
					<img src='/spotify.png' className='size-8' alt='Spotify logo' />
					<Label className="text-lg font-semibold">Spotify</Label>
				</div>
				<div className='flex items-center gap-4'>
					<Button 
						variant="outline" 
						className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
						onClick={() => setIsSubscriptionOpen(true)}
					>
						<Crown className="size-4 mr-2" />
						Upgrade to Premium
					</Button>

					{isAdmin && (
						<Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
							<LayoutDashboardIcon className='size-4  mr-2' />
							Admin Dashboard
						</Link>
					)}

					<SignedOut>
						<SignInOAuthButtons />
					</SignedOut>

					<UserButton />
				</div>
			</div>

			<SubscriptionForm 
				open={isSubscriptionOpen} 
				onOpenChange={setIsSubscriptionOpen} 
			/>
		</>
	);
};
export default Topbar;
