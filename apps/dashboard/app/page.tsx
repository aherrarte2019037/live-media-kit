import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	Button,
	FieldGroup,
	Field,
	FieldLabel,
	FieldDescription,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@repo/ui";

export default function DashboardPage() {
	return (
		<main className="min-h-screen p-8">
			<h1 className="text-4xl font-bold">Dashboard</h1>
			<p className="mt-4 text-muted-foreground">
				Creator Admin Portal - Coming soon
			</p>
			<div className="mt-8">
				<Card>
					<CardHeader>
						<CardTitle>Enter verification code</CardTitle>
						<CardDescription>
							We sent a 6-digit code to your email.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="otp">Verification code</FieldLabel>
									<InputOTP maxLength={6} id="otp" required>
										<InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
											<InputOTPSlot index={0} />
											<InputOTPSlot index={1} />
											<InputOTPSlot index={2} />
											<InputOTPSlot index={3} />
											<InputOTPSlot index={4} />
											<InputOTPSlot index={5} />
										</InputOTPGroup>
									</InputOTP>
									<FieldDescription>
										Enter the 6-digit code sent to your email.
									</FieldDescription>
								</Field>
								<FieldGroup>
									<Button type="submit">Verify</Button>
									<FieldDescription className="text-center">
										Didn&apos;t receive the code? <a href="#">Resend</a>
									</FieldDescription>
								</FieldGroup>
							</FieldGroup>
						</form>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
