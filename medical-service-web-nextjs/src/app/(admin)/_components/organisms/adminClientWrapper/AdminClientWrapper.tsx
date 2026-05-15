"use client";
import React from "react";
import {ADMIN_SIDEBAR_ITEMS} from "@/app/(admin)/_values/constants";
import {ArrowLeftFromLine, ArrowRightFromLine} from "lucide-react";
import { useResponsiveSidebar } from "@/app/(admin)/_components/hooks/useResponsiveSidebar";
import AdminSidebar from "../sidebar/AdminSidebar";

interface AdminClientWrapperProps {
	children: React.ReactNode;
}

export default function AdminClientWrapper({ children }: AdminClientWrapperProps) {
	const { isOpen, setIsOpen, windowWidth } = useResponsiveSidebar(true, 1024);

	const sidebarWidthClass = isOpen ? "w-[300px]" : "w-0";
	
	return (
		<div className={"min-h-screen bg-zinc-700/5 dark:bg-zinc-900"}>
			<div className="flex">
				<div className={`${sidebarWidthClass} transition-all duration-300 fixed top-0 left-0 h-screen z-30 overflow-hidden`}>
					<AdminSidebar
						title={"Quản lí phòng khám"}
						items={ADMIN_SIDEBAR_ITEMS}
					/>
				</div>

				<button
					className={`fixed top-4 ${isOpen ? "left-[19rem]" : "left-2"} z-40 w-8 h-8 rounded-md shadow cursor-pointer bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-gray-100 transition-all`}
					onClick={() => setIsOpen((prev) => !prev)}
					title={isOpen ? "Thu gọn sidebar" : "Mở sidebar"}
				>
					{isOpen ? <ArrowLeftFromLine className={"mx-auto w-4 h-4"} /> : <ArrowRightFromLine className={"mx-auto w-4 h-4"} />}
				</button>

				<main
					className={`${isOpen ? "ml-[300px]" : "ml-0"} transition-all duration-300 flex-1 min-w-0`}
					onClick={() => {
						if (windowWidth < 1024 && isOpen) setIsOpen(false);
					}}
				>
					<div className="w-full px-4 md:px-6 lg:px-8 py-8 overflow-x-auto">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}