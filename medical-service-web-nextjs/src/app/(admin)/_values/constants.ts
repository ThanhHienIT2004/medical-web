import {BookMarked, ChartBar, CalendarCheck, ClipboardList, Clock, FileText, History, Layers, NotebookPen, Pill, Timer, UserRound, Users, Wrench} from "lucide-react";
import { SidebarItem } from "../_components/organisms/sidebar/AdminSidebar";

export const ADMIN_SIDEBAR_ITEMS: SidebarItem[] = [
	{ title: 'Dashboard', href: '/admin-dashboard', icon: ChartBar },
	{ title: 'Quản lý người dùng', href: '/user-manage', icon: Users },
	{ title: 'Danh sách bác sĩ', href: '/doctor-manage', icon: UserRound},
	{ title: 'Danh sách bệnh nhân', href: '/patient-manage', icon: Users },
	{ title: 'Lịch hẹn', href: '/admin-appointment-manage', icon: CalendarCheck },
	{ title: 'Khung giờ', href: '/slot-manage', icon: Timer },
	{ title: 'Danh sách thuốc', href: '/medication-manage', icon: Pill },
	{ title: 'Báo cáo khám', href: '/examination-report-manage', icon: FileText },
	{ title: 'Phác đồ điều trị', href: '/treatment-plan-manage', icon: ClipboardList },
	{ title: 'Phác đồ thuốc', href: '/regimen-manage', icon: Layers },
	{ title: 'Bài viết', href: '/blog-post-manage', icon: NotebookPen },
	{ title: 'Tài liệu', href: '/document-manage', icon: BookMarked },
	{ title: 'Audit log', href: '/audit-log', icon: History },
	{ title: 'Lịch làm việc', href: '/schedule-manage', icon: Clock },
	{ title: 'Cài đặt', href: '/SettingManage', icon: Wrench },
];