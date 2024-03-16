import PrintButton from "../components/PrintButton";
import NavBar from "@/app/components/navBar";
import { getInvoiceById } from "@/data/admin/invoice-dto";

export default async function Invoice({
	params,
}: { params: { invoiceId: string; homestay: string } }) {
	const data = await getInvoiceById(+params.invoiceId);
	console.log(params);
	return (
		<div className="w-full">
			<div className="print:hidden">
				<NavBar>Invoice {params.invoiceId}</NavBar>
			</div>
			{data ? (
				<div className="w-full p-8">
					<div className="flex flex-col items-center justify-between md:flex-row">
						<div className="flex flex-col w-full gap-3 md:gap-2">
							<h1 className="flex items-center justify-center mb-8 text-xl font-bold underline md:mb-0 text-primary md:font-normal md:justify-start md:text-3xl">
								{params.homestay}
							</h1>
							<h2 className="flex items-center w-full gap-2 md:justify-start md:text-lg">
								<span className="font-bold min-w-[5rem] md:min-w-[1rem]">
									UPI:
								</span>
								<span className="md:text-lg text-primary">
									8017523017, 6290853406
								</span>
							</h2>
						</div>
						<div className="flex flex-col w-full md:w-auto">
							<h2 className="flex gap-2 text-md">
								<span className="font-bold min-w-[5rem]">Invoice ID:</span>
								<span className="text-primary">{data.id}</span>
							</h2>
							<h2 className="flex items-center gap-2 text-md">
								<span className="font-bold min-w-[5rem]">Date:</span>
								<span className=" text-primary text-nowrap">
									{data.invoiceDate.toDateString()}
								</span>
							</h2>
							<h2 className="flex items-center gap-2 text-md md:hidden">
								<span className="font-bold min-w-[5rem]">Guest:</span>
								<span className="text-primary">{data.guestName}</span>
							</h2>
							<PrintButton />
						</div>
					</div>
					<h1 className="hidden mt-20 text-lg font-semibold text-center md:block">
						Guest Name:{" "}
						<span className="font-normal text-primary">{data.guestName}</span>
					</h1>
					<div className="flex flex-col items-center w-full my-2 text-sm">
						<div className="flex items-center w-full px-2 py-1 rounded-md bg-primary/90 text-primary-foreground">
							<h1 className="font-bold md:text-xl basis-1/3 md:basis-1/2">
								Description
							</h1>
							<h1 className="flex-1 font-bold text-right md:text-xl">
								Quantity
							</h1>
							<h1 className="flex-1 font-bold text-right md:text-xl">Rate</h1>
							<h1 className="flex-1 font-bold text-right md:text-xl">Total</h1>
						</div>
						<h1 className="w-full p-1 px-2 mb-2 font-semibold text-center rounded-sm bg-primary/10">
							Accomodation
						</h1>
						<div className="flex flex-col w-full py-2">
							{data.accomodation.map((item) => (
								<div className="flex items-center w-full px-4">
									<div className="font-semibold md:text-xl basis-1/3 md:basis-1/2">
										{item.name}
									</div>
									<div className="flex-1 font-semibold text-right md:text-xl">
										{item.quantity}
									</div>
									<div className="flex-1 font-semibold text-right md:text-xl">
										Rs. {item.rate}
									</div>
									<div className="flex-1 font-semibold text-right md:text-xl">
										Rs. {item.rate * item.quantity}
									</div>
								</div>
							))}
						</div>
						<h1 className="w-full p-1 px-2 my-2 font-semibold text-center rounded-sm text-md bg-primary/10">
							Food
						</h1>
						<div className="flex flex-col w-full">
							<div className="flex px-4 py-1 italic text-secondary-foreground/80">
								-- Breakfast --
							</div>
							{data.food.map((item) => (
								<div key={item.id}>
									{item.type === "breakfast" && (
										<div className="flex items-center w-full px-4">
											<div className="font-semibold md:text-xl basis-1/3 md:basis-1/2">
												{item.name}
											</div>
											<div className="flex-1 font-semibold text-right md:text-xl">
												{item.quantity}
											</div>
											<div className="flex-1 font-semibold text-right md:text-xl">
												Rs. {item.rate}
											</div>
											<div className="flex-1 font-semibold text-right md:text-xl">
												Rs. {item.rate * item.quantity}
											</div>
										</div>
									)}
								</div>
							))}
						</div>
						<div className="flex flex-col w-full">
							<div className="flex px-4 py-1 italic text-secondary-foreground/80">
								-- Lunch --
							</div>
							{data.food.map((item) => (
								<div key={item.id}>
									{item.type === "lunch" && (
										<div className="flex items-center w-full px-4">
											<div className="font-semibold md:text-xl basis-1/3 md:basis-1/2">
												{item.name}
											</div>
											<div className="flex-1 font-semibold text-right md:text-xl">
												{item.quantity}
											</div>
											<div className="flex-1 font-semibold text-right md:text-xl">
												Rs. {item.rate}
											</div>
											<div className="flex-1 font-semibold text-right md:text-xl">
												Rs. {item.rate * item.quantity}
											</div>
										</div>
									)}
								</div>
							))}
						</div>
						<div className="flex flex-col w-full">
							<div className="flex px-4 py-1 italic text-secondary-foreground/80">
								-- Dinner --
							</div>
							{data.food.map((item) => (
								<div key={item.id}>
									{item.type === "dinner" && (
										<div className="flex items-center w-full px-4">
											<div className="font-semibold md:text-xl basis-1/3 md:basis-1/2">
												{item.name}
											</div>
											<div className="flex-1 font-semibold text-right md:text-xl">
												{item.quantity}
											</div>
											<div className="flex-1 font-semibold text-right md:text-xl">
												Rs. {item.rate}
											</div>
											<div className="flex-1 font-semibold text-right md:text-xl">
												Rs. {item.rate * item.quantity}
											</div>
										</div>
									)}
								</div>
							))}
						</div>
						<h1 className="w-full p-1 px-2 my-2 font-semibold text-center rounded-sm text-md bg-primary/10">
							Others
						</h1>
						<div className="flex flex-col w-full">
							{data.amenities.map((item) => (
								<div className="flex items-center w-full px-4">
									<div className="font-semibold md:text-xl basis-1/3 md:basis-1/2">
										{item.name}
									</div>
									<div className="flex-1 font-semibold text-right md:text-xl">
										{item.quantity}
									</div>
									<div className="flex-1 font-semibold text-right md:text-xl">
										Rs. {item.rate}
									</div>
									<div className="flex-1 font-semibold text-right md:text-xl">
										Rs. {item.rate * item.quantity}
									</div>
								</div>
							))}
						</div>
						<div className="flex items-center w-full px-2 py-1 my-4 rounded-md bg-primary/10">
							<div className="flex text-lg font-bold md:text-2xl basis-3/4">
								Total
							</div>
							<div className="flex-1 px-2 text-lg font-bold text-right md:text-2xl text-primary">
								Rs.&nbsp;
								{data.accomodation.reduce(
									(acc, item) => acc + item.rate * item.quantity,
									0,
								) +
									data.food.reduce(
										(acc, item) => acc + item.rate * item.quantity,
										0,
									) +
									data.amenities.reduce(
										(acc, item) => acc + item.rate * item.quantity,
										0,
									)}
								&nbsp;/-
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="flex items-center justify-center w-full h-full">
					No Invoice Found
				</div>
			)}
		</div>
	);
}