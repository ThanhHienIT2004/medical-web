
import type {Metadata} from "next";
import ServiceCard from "@/components/cards/ServiceCard";
import DoctorPage from "@/app/(guest)/doctor/page";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Trang Chủ - Y Tế Thông Minh",
    description: "Khám phá các dịch vụ y tế chất lượng cao, đặt lịch dễ dàng.",
};

const services = [
    { icon: '🩺', title: 'Khám tổng quát', description: 'Kiểm tra sức khỏe toàn diện với bác sĩ chuyên khoa.' },
    { icon: '🧪', title: 'Xét nghiệm', description: 'Phân tích mẫu nhanh chóng, chính xác với thiết bị hiện đại.' },
    { icon: '💻', title: 'Tư vấn online', description: 'Kết nối với bác sĩ mọi lúc, mọi nơi.' },
];

export default function HomePage() {
    return (
        <div className="flex flex-col">
            {/* Services Section */}
            <section className="min-h-screen py-20 flex items-center bg-zinc-100 dark:bg-gray-800 animate-fade-in-down">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-base md:text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-8">
                        {"Dịch Vụ Của Chúng Tôi"}
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <ServiceCard
                                key={index}
                                icon={service.icon}
                                title={service.title}
                                description={service.description}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="min-h-screen py-20 flex items-center bg-zinc-200 dark:bg-gray-800 animate-fade-in-down">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center">Bác Sĩ Nổi Bật</h2>
                        <DoctorPage limit={4}/>
                        <div className="mt-12 text-center">
                            <Link href="/doctor" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300">
                                Xem tất cả bác sĩ
                            </Link>
                        </div>
                </div>
            </section>

            <section className="min-h-screen py-20 flex items-center bg-zinc-100 dark:bg-gray-800 animate-fade-in-down">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* Thông tin liên hệ */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-3xl font-bold text-blue-700 mb-6 border-b pb-2">
                            📬 Thông Tin Liên Hệ
                        </h2>
                        <div className="space-y-4 text-gray-700 text-base">
                            <p>
                                <span className="font-semibold">📞 Hotline:</span> 1900 123 456
                            </p>
                            <p>
                                <span className="font-semibold">✉️ Email:</span> contact@yte.vn
                            </p>
                            <p>
                                <span className="font-semibold">🏥 Địa chỉ:</span> 123 Đường Sức Khỏe, TP. Hồ Chí Minh
                            </p>
                        </div>
                    </div>
                    <div
                        className="bg-zinc-50 py-12 px-4 rounded-2xl shadow-md border-0.5 flex items-center justify-center text-gray-500 italic">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3909.014343986135!2d107.83805711013663!3d11.550828544386283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3173f79dffe37b83%3A0xa46fe528df77f53a!2zTmfDoyAzIFTDoCBOZ8OgbywgTOG7mWMgVGhhbmgsIELhuqNvIEzhu5ljLCBMw6JtIMSQ4buTbmcgMDI2MzMsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1749112486281!5m2!1svi!2s"
                            width="100%"
                            height="350px"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Địa chỉ Google Map"></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
}