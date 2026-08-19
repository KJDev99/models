import { ArrowUpRight } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import Button from '@/components/ui/button'
import HeroSlider from '@/components/home/hero-slider'
import SearchBar from '@/components/home/search-bar'
import Directions from '@/components/home/directions'
import ActualProjects from '@/components/home/actual-projects'
import CtaBanner from '@/components/home/cta-banner'
import InfoTiles from '@/components/home/info-tiles'
import PopularExecutors from '@/components/home/popular-executors'
import AllInOne from '@/components/home/all-in-one'
import { IMAGES } from '@/components/home/home-data'

export const metadata = pageMetadata('home')

// Figma: Главная — desktop 52:954, mobil 352:20504 / 373:17004.
// Bo'limlar orasidagi masofa: desktop 100px, mobil 40px.
export default function HomePage() {
    return (
        <div className="flex flex-col gap-[40px] bg-light-white pb-[40px] lg:gap-[100px] lg:pb-[100px]">
            {/* Hero va qidiruv paneli yopishib turadi — Figma'da bitta blok (52:1239) */}
            <div className="flex flex-col">
                <HeroSlider />
                <SearchBar />
            </div>

            <Directions />

            <ActualProjects />

            <CtaBanner
                image={IMAGES.ctaCreateProject}
                imageMobile={IMAGES.ctaCreateProjectMobile}
                title={
                    <>
                        Создайте проект для съёмки
                        <br className="hidden lg:inline" /> прямо сейчас
                    </>
                }
                description="Получите отклики от проверенных специалистов сегодня."
                actions={
                    <Button
                        href="/company/projects/new"
                        variant="gold"
                        iconRight={<ArrowUpRight size={22} strokeWidth={2} className="size-[15px] lg:size-[22px]" />}
                        className="w-full lg:w-auto"
                    >
                        Разместить проект
                    </Button>
                }
            />

            <InfoTiles />

            <PopularExecutors />

            <AllInOne />

            <CtaBanner
                image={IMAGES.ctaReadyToStart}
                imageMobile={IMAGES.ctaReadyToStartMobile}
                title={
                    <>
                        Готовы начать
                        <br className="hidden lg:inline" /> съёмочный проект?
                    </>
                }
                description={
                    <>
                        Найдите исполнителя или разместите заявку
                        <br className="hidden lg:inline" /> за несколько минут.
                    </>
                }
                descriptionClass="text-grey"
                actions={
                    <>
                        <Button
                            href="/models"
                            variant="gold"
                            iconRight={<ArrowUpRight size={22} strokeWidth={2} className="size-[15px] lg:size-[22px]" />}
                            className="w-full lg:w-auto"
                        >
                            Найти исполнителя
                        </Button>
                        <Button
                            href="/company/projects/new"
                            variant="white"
                            className="w-full lg:w-auto"
                        >
                            Разместить проект
                        </Button>
                    </>
                }
            />
        </div>
    )
}
