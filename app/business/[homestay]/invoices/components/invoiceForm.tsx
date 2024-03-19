"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { Invoice, invoiceSchema } from "../shared/shared-code";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { DateFieldsType, DatePicker } from "./datePicker";
import FormPage from "@/app/business/[homestay]/invoices/components/formPage";
import { subDays } from "date-fns";
import { generateInvoice } from "../server-actions/server-actions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

const defaultValues = {
	guestName: "",
	invoiceDate: new Date(),
	checkinDate: subDays(new Date(), 2),
	checkoutDate: new Date(),
	accomodation: [
		{
			name: "Room 101",
			quantity: 2,
			rate: 1500,
		},
	],
	food: {
		breakfast: [],
		lunch: [],
		dinner: [],
		snacks: [],
	},
	amenities: [],
};

export default function InvoiceForm({
	homestayId,
	invoice,
}: { homestayId: string; invoice?: Invoice }) {
	const [state, formAction] = useFormState(
		generateInvoice.bind(null, invoice ? "update" : "create"),
		{
			success: false,
		},
	);
	const form = useForm<z.infer<typeof invoiceSchema>>({
		resolver: zodResolver(invoiceSchema),
		defaultValues: {
			...(invoice ? invoice : defaultValues),
			...(state?.fields ?? {}),
		},
	});
	const accomodationList = useFieldArray({
		control: form.control,
		name: "accomodation",
	});
	const breakfastList = useFieldArray({
		control: form.control,
		name: "food.breakfast",
	});
	const lunchList = useFieldArray({
		control: form.control,
		name: "food.lunch",
	});
	const dinnerList = useFieldArray({
		control: form.control,
		name: "food.dinner",
	});
	const snacksList = useFieldArray({
		control: form.control,
		name: "food.snacks",
	});
	const amenitiesList = useFieldArray({
		control: form.control,
		name: "amenities",
	});
	const [pageNo, setPageNo] = useState(1);
	return (
		<Form {...form}>
			<form
				action={formAction}
				onSubmit={(event) => {
					event.preventDefault();
					form.handleSubmit(() => {
						const formData = new FormData();
						if (invoice?.id) {
							formData.append("id", `${invoice.id}`);
						}
						formData.append("guestName", form.getValues("guestName"));
						formData.append(
							"invoiceDate",
							form.getValues("invoiceDate").toString(),
						);
						formData.append(
							"checkinDate",
							form.getValues("checkinDate").toString(),
						);
						formData.append(
							"checkoutDate",
							form.getValues("checkoutDate").toString(),
						);
						formData.append("homestayId", homestayId);
						formData.append(
							"accomodation",
							JSON.stringify(form.getValues("accomodation")),
						);
						formData.append(
							"food",
							JSON.stringify({
								breakfast: form.getValues("food.breakfast"),
								lunch: form.getValues("food.lunch"),
								dinner: form.getValues("food.dinner"),
								snacks: form.getValues("food.snacks"),
							}),
						);
						formData.append(
							"amenities",
							JSON.stringify(form.getValues("amenities")),
						);
						formAction(formData);
					})(event);
				}}
				className="flex flex-col w-full gap-8"
			>
				{/* Basic Details */}
				{pageNo === 1 && (
					<>
						<div className="flex flex-col gap-2">
							<FormField
								control={form.control}
								name="guestName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Guest name:</FormLabel>
										<FormControl>
											<Input
												{...form.register("guestName")}
												placeholder="Full name of guest"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<FormField
								control={form.control}
								name={"invoiceDate" as DateFieldsType}
								render={({ field }) => (
									<DatePicker label="Invoice date" field={field} />
								)}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<FormField
								control={form.control}
								name={"checkinDate" as DateFieldsType}
								render={({ field }) => (
									<DatePicker label="Checkin date" field={field} />
								)}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<FormField
								control={form.control}
								name={"checkoutDate" as DateFieldsType}
								render={({ field }) => (
									<DatePicker label="Checkout date" field={field} />
								)}
							/>
						</div>
					</>
				)}
				{/* Accomodation */}
				{pageNo === 2 && (
					<FormPage
						type="accomodation"
						label="Accomodation"
						items={accomodationList}
						form={form}
						onAppend={() =>
							accomodationList.append({
								name: "Room 101",
								quantity: 2,
								rate: 1500,
							})
						}
					/>
				)}
				{/* Breakfast */}
				{pageNo === 3 && (
					<FormPage
						type="food.breakfast"
						label="Breakfast"
						items={breakfastList}
						form={form}
						onAppend={() =>
							breakfastList.append({
								name: "Veg Maggie",
								quantity: 2,
								rate: 50,
							})
						}
					/>
				)}
				{/* Lunch */}
				{pageNo === 4 && (
					<FormPage
						type="food.lunch"
						label="Lunch"
						items={lunchList}
						form={form}
						onAppend={() =>
							lunchList.append({
								name: "Egg Thali",
								quantity: 2,
								rate: 150,
							})
						}
					/>
				)}
				{/* Dinner */}
				{pageNo === 5 && (
					<FormPage
						type="food.dinner"
						label="Dinner"
						items={dinnerList}
						form={form}
						onAppend={() =>
							dinnerList.append({
								name: "Chicken Thali",
								quantity: 2,
								rate: 250,
							})
						}
					/>
				)}
				{/* Snacks */}
				{pageNo === 6 && (
					<FormPage
						type="food.snacks"
						label="Snacks"
						items={snacksList}
						form={form}
						onAppend={() =>
							snacksList.append({
								name: "Chicken Pakora",
								quantity: 2,
								rate: 250,
							})
						}
					/>
				)}
				{/* Amenties */}
				{pageNo === 7 && (
					<FormPage
						type="amenities"
						label="Amenities"
						items={amenitiesList}
						form={form}
						onAppend={() =>
							amenitiesList.append({
								name: "Room Heater",
								quantity: 1 * 2,
								rate: 300,
							})
						}
					/>
				)}
				{/* Submit */}
				<div className="flex flex-col gap-4">
					<div className="flex items-center w-full gap-2 ">
						<button
							type="button"
							className="px-4 py-1 text-lg font-semibold rounded-md basis-1/2 bg-accent text-primary-foreground"
							onClick={() => {
								pageNo > 1 && setPageNo((prev) => prev - 1);
							}}
						>
							Back
						</button>
						<button
							type="button"
							className="px-4 py-1 text-lg font-semibold rounded-md basis-1/2 bg-accent text-primary-foreground"
							onClick={() => {
								pageNo < 7 && setPageNo((next) => next + 1);
							}}
						>
							Next
						</button>
					</div>
					<SubmitButton action={invoice ? "update" : "create"} />
				</div>
			</form>
			{state.success && (
				<div className="flex flex-col items-center w-full py-4 text-sm">
					<span>
						{state.message}.&nbsp;
						<Link
							href={
								invoice
									? `/business/${homestayId}/invoices/${invoice.id}`
									: `/business/${homestayId}/invoices/${state.fields?.id}`
							}
							className="w-full underline text-accent underline-offset-4"
						>
							View
						</Link>
					</span>
				</div>
			)}
			{state?.issues && (
				<div className="text-red-500">
					<ul>
						{state.issues.map((issue, index) => (
							<li
								key={`${issue}_${
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									index
								}`}
								className="flex gap-1"
							>
								<X fill="red" />
								{issue}
							</li>
						))}
					</ul>
				</div>
			)}
		</Form>
	);
}
function SubmitButton({ action }: { action: "create" | "update" }) {
	const { pending } = useFormStatus();
	return (
		<>
			<Button
				type="submit"
				aria-disabled={pending}
				className="px-4 py-1 text-lg font-semibold rounded-md bg-primary text-primary-foreground"
			>
				{pending
					? `${action === "create" ? "Generating" : "Updating"} Invoice...`
					: `${action === "create" ? "Generate" : "Update"}  Invoice`}
			</Button>
			<div>{pending ? "Please wait..." : ""}</div>
		</>
	);
}