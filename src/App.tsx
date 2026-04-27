/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X } from 'lucide-react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db, isConfigValid } from './lib/firebase';

// --- Types ---
interface ProjectImage {
  url: string;
  caption?: string;
}

interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  thumbnail: string;
  images: ProjectImage[];
  createdAt: string;
  galleryIntro?: string;
  galleryOutro?: string;
}

const CATEGORIES = [
  '공공디자인',
  '브랜딩디자인',
  '시각디자인',
  '인테리어디자인',
  '행사디자인'
];

// --- Data ---
const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'sejong-shared-campus-banner-public-new',
    number: '01',
    title: '세종공동캠퍼스 외벽 현수막',
    subtitle: 'PUBLIC DESIGN / Environmental Graphics',
    description: '세종공동캠퍼스의 개교와 비전을 홍보하기 위해 대형 외벽 공간을 활용한 임팩트 있는 비주얼 메시지 및 현수막 디자인 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://drive.google.com/file/d/1K7IQjvhVstr-JE2sQu7L3OyUB3U0in4O/view?usp=drive_link',
    galleryIntro: '세종공동캠퍼스 외벽현수막 및 포토존: 세종공동캠퍼스 현장에\n외벽 현수막과 포토존 제작 및 설치를 진행했습니다.',
    images: [
      { url: 'https://drive.google.com/file/d/1z1SdCrOlWGscIT_bwAUvrDeROmaQgKUy/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1_08JROEVopNMcZYQ1vNdt3jLSRPFULAP/view?usp=drive_link' }
    ],
    galleryOutro: '외벽 현수막은 멀리서도 잘 보일 수 있도록\n대형 사이즈와 높은 가독성 중심으로 제작했으며,\n포토존은 공간의 분위기를 살리면서\n방문객들이 자연스럽게 사진을 남길 수 있도록 구성했습니다.\n\n현장 환경과 동선을 고려한 시공으로\n완성도 높은 결과물을 마무리했습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'campus-high-evacuation-map-public-new',
    number: '02',
    title: '캠퍼스고등학교 피난안내도',
    subtitle: 'PUBLIC DESIGN / Safety & Information Design',
    description: '캠퍼스고등학교 학생들의 안전한 대피 환경을 조성하기 위해 시인성과 가독성을 최적화한 통합 피난안내도 디자인 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://drive.google.com/file/d/1XTftU_wf9DTac-2adMEwT_8nBWu5sS_K/view?usp=drive_link',
    galleryIntro: '캠퍼스고등학교 피난안내도:  캠퍼스고등학교 내 피난안내도 제작 및 설치를 진행했습니다.',
    images: [
      { url: 'https://drive.google.com/file/d/1UbYwlZqqa7IQ7LMB44w1JnYOQh_YeIM4/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1sajxzwI28YSQg7SjW3JX9AjR4Q8lmM_0/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1etk00D6ftRHBfRHW9BCEL1Rsv9EWPDhC/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1aUdQO9YKW2NJKWofwA4KUGH3QnLySDtu/view?usp=drive_link' }
    ],
    galleryOutro: '학생과 교직원의 안전을 최우선으로 고려하여\n누구나 쉽게 이해할 수 있도록 가독성 높은 디자인으로 제작했으며,\n비상 시 신속한 대피가 가능하도록 위치와 동선을 반영했습니다.\n\n내구성 있는 소재와 깔끔한 마감으로\n안전성과 완성도를 동시에 높인 시공을 완료했습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sejong-transit-flagpole-public-new',
    number: '03',
    title: '세종도시교통공사 국기게양대',
    subtitle: 'PUBLIC DESIGN / Facilities Design',
    description: '세종도시교통공사의 위상과 상쾌한 도시 이미지를 결합한 현대적인 국기게양대 공공 시설물 디자인 및 설치 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://drive.google.com/file/d/1GZCwVGobubmSTomQ1URYmw_llfC_ZQYD/view?usp=drive_link',
    galleryIntro: '세종도시교통공사 국기게양대: \n세종도시교통공사 현장에\n국기게양대 제작 및 설치를 진행했습니다.',
    images: [
      { url: 'https://drive.google.com/file/d/1OUQFfwQY6yiYmimlKRaRLnCiVmka6kc8/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1_Pb1B0ftxIToVu5-W-SV-ksK2mwjyjuo/view?usp=drive_link' }
    ],
    galleryOutro: '외부 환경에 적합한 내구성 높은 소재를 사용하여\n장기간 안정적으로 사용할 수 있도록 시공했으며,\n견고한 기초 작업을 통해 안전성을 확보했습니다.\n\n공공기관에 어울리는 깔끔한 마감으로\n현장의 품격을 높이는 국기게양대를 완성했습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sejong-transit-ouling-public-new',
    number: '04',
    title: '세종도시교통공사 어울링대여소',
    subtitle: 'PUBLIC DESIGN / Urban Infrastructure',
    description: "세종시 공영자전거 '어울링' 대여소의 시인성과 사용성을 높이기 위한 통합 공공 시각 디자인 및 시설물 브랜딩 프로젝트입니다.",
    category: '공공디자인',
    thumbnail: 'https://drive.google.com/file/d/1eDC9JDtsnAo_GnGgeHt0ArxoheEFtgh8/view?usp=drive_link',
    galleryIntro: '세종도시교통공사 어울링 대여소:  세종도시교통공사 어울링 자전거 대여소 제작 및 설치를 진행했습니다.',
    images: [
      { url: 'https://drive.google.com/file/d/1OEuABrPkJuIWhh-D-SmxvMYZ4q6Jh_lN/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1djom6q-2Tn2tZBn6oNAe8K6VosEud8ds/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1Su5p_a9NbOkNCMtlbaId1u7M3fzQX87k/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1LlhWAyyLoI03M1o-j1GQeySuKfH6bP5t/view?usp=drive_link' }
    ],
    galleryOutro: '외부 환경에 적합한 견고한 구조로 제작하여\n내구성과 안전성을 높였으며,\n이용자들이 쉽게 인식할 수 있도록\n가독성 중심의 디자인으로 마감했습니다.\n\n현장 동선과 접근성을 고려해\n편리한 이용이 가능하도록 설치를 완료했습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'yeondong-myun-bulletin-public-new',
    number: '05',
    title: '연동면사무소 게시판',
    subtitle: 'PUBLIC DESIGN / Information Board',
    description: '연동면사무소의 행정 정보를 주민들에게 효율적으로 전달하기 위해 설계된 기능적이고 미학적인 공공 게시판 디자인 및 설치 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://drive.google.com/file/d/19CsA270K1xGYtbjFurle0-g4yI3T_YH_/view?usp=drive_link',
    galleryIntro: '연동면 스텐 지주 게시판: 외부 환경에 노출되는 제품인 만큼\n부식에 강한 스테인리스 소재를 사용하여 내구성을 높였고,\n장기간 사용에도 변형 없이 유지될 수 있도록 제작했습니다.',
    images: [
      { url: 'https://drive.google.com/file/d/10z2_i6P9HtS2Mpc9eiGbAC-K3vm3ivN0/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1_DxCX9HotyxE_nJq9ePwHOsBmY-mZ5Za/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1kQiZScdWUOhzc74dBYtfMk_o78IaDGYM/view?usp=drive_link' }
    ],
    galleryOutro: '지주 구조는 안정성을 고려해 견고하게 시공하였으며,\n가독성이 좋은 게시판 면 구성으로 정보 전달력을 강화했습니다.\n\n현장 환경과 동선을 고려한 위치 선정으로\n이용자들이 쉽게 확인할 수 있도록 설치를 마무리했습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'en-corp-signage-branding-new',
    number: '01',
    title: '이엔코퍼레이션 후렉스 간판/지주간판',
    subtitle: 'BRANDING DESIGN / Corporate Signage',
    description: '이엔코퍼레이션의 기업 이미지를 강화하고 공간의 전문성을 높이는 통합 후렉스 간판 및 지주간판 디자인 프로젝트입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://drive.google.com/file/d/1oQ3r_Y0G90WOAKoMQXze4T3gTuu7jqtU/view?usp=drive_link',
    galleryIntro: '이엔코퍼레이션_후렉스간판지주간판: 지주형 돌출간판 제작 및 설치를 진행했습니다.',
    images: [
      { url: 'https://drive.google.com/file/d/1YzVTTqruAmKJL2LnpRZweUMyYjwo5ca8/view?usp=drive_link' }
    ],
    galleryOutro: '보행자와 차량 모두에서 잘 보일 수 있도록\n돌출형 구조로 시인성을 높였으며,\n견고한 지주 프레임으로 안정성을 확보했습니다.\n\n외부 환경에 강한 내구성 중심의 시공으로\n완성도 높은 간판 설치를 마무리했습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'plan-to-plan-indoor-signage-public-new',
    number: '06',
    title: '플랜투플랜 실내간판',
    subtitle: 'PUBLIC DESIGN / Indoor Signage',
    description: '플랜투플랜: 화이트 톤의 깔끔한 인테리어에 맞춰\n입체 간판과 돌출 사인을 미니멀하게 디자인하여\n공간의 분위기를 해치지 않으면서도\n브랜드 아이덴티티를 자연스럽게 표현했습니다.',
    category: '공공디자인',
    thumbnail: 'https://drive.google.com/file/d/1YB7WMzRA_YL8fy1vMunAtPQlvf-gK9_d/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1YI8Hvjzhrt9vwVEuIw7ZO2WmFUWzOBDq/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1bX5CwBg-obHwdQ2E4flcCGbGflka-2A3/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1PqSWBrwZi2SRzg-W7NlhRwdeHXxNQCtV/view?usp=drive_link' }
    ],
    galleryOutro: '유리 도어에는 시트 작업으로 시인성을 높이고,\n전체적으로 정돈된 느낌의 사인 구성을 완성했습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bohun-committee-signage-public-new',
    number: '07',
    title: '보훈심사위원회 채널간판',
    subtitle: 'PUBLIC DESIGN / Building Signage',
    description: '보훈심사위원회: 이번 프로젝트는 보훈심사위원회 건물 외부 채널간판 제작 및 시공을 진행했습니다.\n공공기관의 상징성과 신뢰감을 고려하여 정돈된 디자인과 높은 완성도를 목표로 작업했습니다.',
    category: '공공디자인',
    thumbnail: 'https://drive.google.com/file/d/1Iwmbkvn-f2gcP2bP2n9S-NM7Cvgst47-/view?usp=drive_link',
    galleryIntro: '외부 고층 간판은 구조 안정성이 중요한 만큼\n견고한 프레임 제작과 안전한 고정 방식을 적용했습니다.',
    images: [
      { url: 'https://drive.google.com/file/d/1Iwmbkvn-f2gcP2bP2n9S-NM7Cvgst47-/view?usp=drive_link' }
    ],
    galleryOutro: '풍하중과 외부 환경을 고려해\n장기간 유지될 수 있도록 내구성 중심으로 시공을 진행했습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sejong-arts-center-signage-public-new',
    number: '08',
    title: '세종문화예술회관 지주간판/입간판',
    subtitle: 'PUBLIC DESIGN / Signage System',
    description: '세종문화예술회관 지주간판: 이번 프로젝트는 세종문화예술회관 내 방문객들의 편의성을 높이기 위한\n외부 지주형 안내 간판 제작 및 설치 작업을 진행했습니다.',
    category: '공공디자인',
    thumbnail: 'https://drive.google.com/file/d/1wFFRSNIrTXf338vPZcGmAKcZ-wevNh5E/view?usp=drive_link',
    galleryIntro: '주차장 안내를 보다 직관적으로 전달하는 것이 핵심이었으며,\n시인성과 내구성을 동시에 고려해 제작했습니다. 외부 안내 간판은 단순한 정보 전달을 넘어\n공간의 첫인상을 결정하는 중요한 요소입니다.',
    images: [
      { url: 'https://drive.google.com/file/d/1jPTS7ecz3lYKmjwWWyougKC98wJaAGL8/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1CuAJbJnYXtD3ls7HfV6w-oZuSrYHVegJ/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1OHduK46Fl6FSQjiwJJNn_aqQudge7ISD/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1wXMyEANz9GhYXmO0BKTPcg4kp9dYZOO2/view?usp=drive_link' }
    ],
    galleryOutro: '앞으로도 다양한 환경과 목적에 맞는\n맞춤형 간판 제작 및 시공으로 최적의 결과물을 제공하겠습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'daepyeong-dong-welfare-center-sculpture-public-new',
    number: '09',
    title: '대평동 행정복지센터 조형물',
    subtitle: 'PUBLIC DESIGN / Artwork & Sculpture',
    description: '대평동 조형물: 이번 프로젝트는 대평동 일대 경관 개선과 공간 활성화를 위한\n조형물 제작 및 설치를 진행했습니다.',
    category: '공공디자인',
    thumbnail: 'https://drive.google.com/file/d/126kYbUgruGk9HUUOOIAzpfOhss9XpLWN/view?usp=drive_link',
    galleryIntro: '단순한 구조물이 아닌,\n주민들이 머물고 즐길 수 있는 공간 요소로서의 역할을 중심으로 기획했습니다. 야외 설치 환경을 고려해\n내구성과 안전성을 최우선으로 제작했습니다.',
    images: [
      { url: 'https://drive.google.com/file/d/1bntIskSAS9iOZcGfqZMqwMPYWfcmcMea/view?usp=drive_link' },
      { 
        url: 'https://drive.google.com/file/d/1j4vlzddKjs2iTJnT-EgpdDebTjiog7yJ/view?usp=drive_link',
        caption: '모서리 마감과 구조 안정성을 꼼꼼히 확인했으며,\n장기간 사용에도 변형이나 훼손이 없도록 시공을 진행했습니다.'
      },
      { url: 'https://drive.google.com/file/d/1dnRvRR1UwQ2sW-vXdU-wEJ2qjni6NKnO/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1gESdsivLN9Zrd94qriaVEyVevlF-sWPL/view?usp=drive_link' }
    ],
    galleryOutro: '또한 현장 동선을 고려해\n보행에 방해되지 않도록 위치와 간격을 세심하게 배치했습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'yongpo-ro-sign-improvement-public-new',
    number: '10',
    title: '용포로 간판개선사업',
    subtitle: 'PUBLIC DESIGN / Signage Improvement',
    description: '용포로 일대의 도시 미관을 개선하고 상권 활성화를 위해 진행된 통합 간판 디자인 및 거리 경관 개선 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://drive.google.com/file/d/1Z7OzyrziulcfIPshzSwYTjonsKXwXDV4/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1GeuTIzL-53pNtkInUM5Ay1QPxQd5OA1T/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/15VDu6PNl6Md4CUxT7rWiWjmCtNcZurRb/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1AFCgU122MfaHCJx_ZNHfPlZCsvEe8P2b/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1qEq0gfNKQzxmsmrBSczsy3Vo2zEA4qCh/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/19K_Z5Iv_7itT5Dz4ZsnQd6JBR_fZVs4W/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1FPedO8zEDFdqBx3M_Icaz389N_7bYy2V/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1GccguMeyL8T-Kz6_p19CPMSbQi5vAx3z/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'jeonui-community-center-public-new',
    number: '11',
    title: '전의면복합커뮤니티센터',
    subtitle: 'PUBLIC DESIGN / Community Branding',
    description: '전의면복합커뮤니티센터: 상부에 설치된 채널간판은 멀리서도 식별이 가능하도록 크기와 간격을 조정했으며,\n기관의 신뢰감을 전달할 수 있도록 깔끔한 서체를 사용했습니다. 고층 외벽에 설치되는 만큼\n구조적 안정성을 최우선으로 시공을 진행했습니다.',
    category: '공공디자인',
    thumbnail: 'https://drive.google.com/file/d/1sQ3RXGlhCkegCufB7s3t063ZmDZdis1U/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1EWO2xyltrq5XO9Bxh9XU7UlQ9giA7U6H/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/16TWtiNOlFbauvZkr_gOypHmhiN1Hr9MM/view?usp=drive_link' }
    ],
    galleryOutro: '튼튼한 고정 방식과 내후성이 뛰어난 자재를 사용해\n강풍 및 외부 환경에도 견딜 수 있도록 작업했습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'korea-rural-community-public-new',
    number: '12',
    title: '한국농어촌공사',
    subtitle: 'PUBLIC DESIGN / Corporate Branding',
    description: '한국농어촌공사의 농어촌 발전 가치를 담아낸 시각 디자인 및 공공 브랜딩 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://drive.google.com/file/d/1AMSlggrJnP8RsxM_tPCozUyiIEmJPp0Y/view?usp=drive_link',
    galleryIntro: '농어촌공사 간판: 외부 채널 간판 특성상 내구성이 중요한 만큼\n견고한 구조로 제작하고 안정적인 고정 방식을 적용했습니다.',
    images: [
      { url: 'https://drive.google.com/file/d/17nyQAQ9r98I4weofglzQAXx7ax0o98_Z/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1HlytREF82W-6-V-Hc0z6ujmwAlU-IEQr/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/12FrBnMzEIFtyVwykljpYKeGx6kNYNeup/view?usp=drive_link' }
    ],
    galleryOutro: '기상 변화에도 변형이나 탈락 없이 유지될 수 있도록\n세심하게 시공을 진행했습니다. 외부 간판은 단순한 표지판이 아닌\n기관의 이미지를 보여주는 중요한 요소입니다.\n\n앞으로도 공간과 목적에 맞는 최적의 간판 제작 및 시공으로\n완성도 높은 결과물을 제공하겠습니다',
    createdAt: new Date().toISOString()
  },
  {
    id: 'fruit-of-love-temperature-column-public-new',
    number: '13',
    title: '사랑의열매 온도탑',
    subtitle: 'PUBLIC DESIGN / Symbolic Installation',
    description: '사랑의열매: 연말이 다가오면 거리 곳곳에서 볼 수 있는 ‘사랑의온도탑’은 나눔의 온도를 눈으로 확인할 수 있는 상징적인 구조물입니다.\n이번 프로젝트에서는 사랑의열매 사랑의온도탑 구조물 제작 및 설치를 진행했습니다.',
    category: '공공디자인',
    thumbnail: 'https://drive.google.com/file/d/1vx1vxtiBL1y7Km0-dJBPIqJJaWv2Wv9t/view?usp=drive_link',
    galleryIntro: '사랑의온도탑은 일정 모금액이 달성될 때마다 온도가 올라가는 형태로, 시민들의 참여를 이끌어내는 중요한 역할을 합니다.\n그만큼 디자인과 구조 안정성, 시인성까지 모두 고려한 제작이 필요합니다. 이번 온도탑은 야외 설치를 고려하여 내구성이 뛰어난 소재를 사용했습니다.\n주요 구조는 견고한 프레임을 기반으로 제작되었으며, 외부 마감은 깔끔한 그래픽 출력물을 적용해 가독성과 전달력을 높였습니다.',
    images: [
      { 
        url: 'https://drive.google.com/file/d/1nOCCufmMA1PbpaHoQx5w0oxPIEFace0J/view?usp=drive_link',
        caption: '특히 온도 표시 구간은 멀리서도 한눈에 보일 수 있도록 컬러 대비와 크기를 충분히 확보해 제작했습니다.\n앞으로도 다양한 공공 캠페인 및 행사 구조물 제작 경험을 바탕으로 완성도 높은 결과물을 제공해드리겠습니다.'
      },
      { url: 'https://drive.google.com/file/d/11Rp9m7CFPBGH6sjyT2pfCYWwnnzcq1FA/view?usp=drive_link' }
    ],
    galleryOutro: '사랑의온도탑처럼 의미 있는 프로젝트는\n디자인부터 제작, 설치까지 더욱 정성을 담아 진행하고 있습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sejong-arboretum-public-new',
    number: '14',
    title: '국립세종수목원',
    subtitle: 'PUBLIC DESIGN / Environmental Graphics',
    description: '수목원:자연과 사람이 어우러지는 공간,\n국립세종수목원 내 다양한 조형물 제작 및 설치를 진행했습니다.',
    category: '공공디자인',
    thumbnail: 'https://drive.google.com/file/d/1F2dujqfRSYO414rvIksvoSBfJENAfD8h/view?usp=drive_link',
    galleryIntro: '이번 프로젝트는 단순한 구조물 설치를 넘어\n공간의 분위기와 조화를 이루는 디자인 요소로서의 역할을 중점으로 작업했습니다. 현장 여건을 고려해 동선 방해를 최소화하며 설치를 진행했습니다.',
    images: [
      { url: 'https://drive.google.com/file/d/16tZ7pQon6mYjZt8booUhm9aJQiQ2sEmF/view?usp=drive_link' },
      { 
        url: 'https://drive.google.com/file/d/1SOnZNZvmequ9u5r4INkDGRlETZxh1Y7V/view?usp=drive_link',
        caption: '구조물 고정 및 수평 작업을 꼼꼼히 진행했고,\n잔디 및 주변 시설 훼손 없이 안정적으로 시공을 마무리했습니다.'
      },
      { url: 'https://drive.google.com/file/d/1_Hi_GP3hXmMarBF_o7ftb_4S69jkR4Tg/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1_J0QOB5qg448li-1DBU8q0IXxPk6D89w/view?usp=drive_link' }
    ],
    galleryOutro: '각 조형물 간 간격과 시선 흐름까지 고려해\n방문객이 자연스럽게 이동하고 머무를 수 있도록 배치했습니다.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'nasung-fc-branding-new',
    number: '02',
    title: '나성FC',
    subtitle: 'BRANDING DESIGN / Football Club Identity',
    description: '나성FC의 정체성과 단합력을 상징하는 엠블럼 디자인 및 통합 브랜딩 시스템 구착 프로젝트입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://drive.google.com/file/d/1Ih9pBA_kWuVcqagTyw0T1Qu5TDXZ7XmH/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1diPWdhYDUM5faW00QRNYPw5I3g3gP-Gz/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1wUvWBXZq_C6JpAGxA77MifbTrMQo1L_h/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'allstar-batting-branding-new',
    number: '03',
    title: '올스타배팅센터',
    subtitle: 'BRANDING DESIGN / Sports Brand Identity',
    description: '올스타배팅센터의 열정적이고 역동적인 스포츠 에너지를 시각화한 로고 디자인 및 통합 브랜딩 프로젝트입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://drive.google.com/file/d/1W3txfzhIuk5KdMoRbHNuKnIH9cWLJZ8n/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1EpbtMYC943xuksaxo5eRRw87qR7FZ51Y/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'daol-farm-studio-branding-new',
    number: '04',
    title: '다올팜스튜디오',
    subtitle: 'BRANDING DESIGN / Agricultural Brand Identity',
    description: '다올팜스튜디오의 신선하고 자연 친화적인 이미지를 구축하기 위한 통합 브랜드 아이덴티티 및 패키지 디자인 프로젝트입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://drive.google.com/file/d/1n2rmShne-CXtQyHYc3RfR82oDZiHG_OA/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1sVGN6zrDUR-W8-Ta4gAhUqW-GeLylXAQ/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1byKWhpjun051fLMJXhzGEgI_oPDuwv15/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1SZ8-quIUhhQJktl8eFQhUE1zJIwZcmOo/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1uYc2y-Qa-92L_3TqptpUSS4PEBpV5u2S/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1BrwKBcO9GfUMvaONNg4-OtMh2JxX0UHr/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1VGqKeMNpv6z428ZBhu0lg4oyZ-DN00bF/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1iLk5pyojURsetPDuQQrvb78iFNE5RwN1/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'nasung-kindergarten-branding-new',
    number: '05',
    title: '나성유치원',
    subtitle: 'BRANDING DESIGN / Educational Identity',
    description: '나성유치원의 따뜻하고 창의적인 교육 환경을 반영한 브랜드 아이덴티티 및 공간 브랜딩 프로젝트입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://drive.google.com/file/d/17H_NGfUG66X_9MJm7l9GM6Stb3iebS5m/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1le-gzCMyjn-VdtJlyVja-yzgDviQHdhQ/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1Szo6whKrp4qxzdfpdIuF0TUSsAggLq3A/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1cPSfjm32fiTJsIaK5i536bXG6Rm1jqT6/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1LK_P2pDcaOxoUzfHrf0DA7xfbzJGLg8H/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1mB5MVcsPBYECnB4tGGnRUL0VbY5RHcFn/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1hG1gWfQ3S-4z3kDy9ByPnecuJdTpUt4B/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1oqdrUm93_J0vRENo9MCWv8cdJ0jNJNSB/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sejong-teacher-union-branding-new',
    number: '06',
    title: '세종교사노동조합',
    subtitle: 'BRANDING DESIGN / Organization Identity',
    description: '세종교사노동조합의 정체성과 가치를 시각적으로 표현한 브랜드 아이덴티티 및 통합 브랜딩 솔루션 프로젝트입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://drive.google.com/file/d/1HL2-7ZMI8_OtniL1XIQOdiY2pVon5ayw/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1HL2-7ZMI8_OtniL1XIQOdiY2pVon5ayw/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'izakaya-bam-branding-new',
    number: '07',
    title: '이자카야 밤',
    subtitle: 'BRANDING DESIGN / Izakaya Identity',
    description: "심야 식당 '밤(BAM)'의 감성적인 분위기를 담아낸 로고 디자인 및 메뉴판, 내부 사인 시스템 브랜딩 프로젝트입니다.",
    category: '브랜딩디자인',
    thumbnail: 'https://drive.google.com/file/d/1NPCRK3tYGI9QBgJwA-OXV2LptedsNrjP/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1KVjhFFEGCql9SL7VrXKnEUX_QwLRhq6m/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1ZHsMiYjSVRiBen58ojggHbsMWs6eSAp0/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1gfk4rnnHMLOipW_y2Du7V4Akkdb3ZL-B/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'tarot-monad-branding-new',
    number: '08',
    title: '타로모나드',
    subtitle: 'BRANDING DESIGN / Tarot Brand Identity',
    description: '타로모나드(Tarot Monad)의 신비롭고 깊이 있는 철학을 시각화한 브랜드 로고 디자인 및 어플리케이션 시스템 통합 브랜딩 프로젝트입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://drive.google.com/file/d/1nlfJ28VMHgv5xb1CrSGeJV2zIORnDLwt/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/10d8juiP6Mpt9VnNuSOEusYMuWnka2R2Q/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1nqKe7cKnS4ojxWmnptDlqxXwbmtaWaJ0/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1HkF2OK7x1g8VtFeT_24LYqaZP6Xx6bui/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1yN9pLErP-KNCreEcE1SLzwvO2FOWDhgI/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1AconhmMgnKuJBVv5CuFYrXalSlZ9u2Sf/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/16Koj2mulTsk5sjG1hcUIM7FQF5mk_Gqb/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/10rVKH71dAB_x1h4Ie4STfyR3DdopEMS9/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'onsejong-highschool-branding-new',
    number: '09',
    title: '온세종고등학교',
    subtitle: 'BRANDING DESIGN / School Identity',
    description: '온세종고등학교의 교육 가치와 상징성을 현대적으로 해석한 학교 브랜드 아이덴티티 및 응용 디자인 시스템 구축 프로젝트입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://drive.google.com/file/d/1zo6hMJWnIkirLTr1fFITiDDBICnXcMRg/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1igfVzQnP-iRHgVWkmyAvyK3j880sJRlO/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1JQh1f3XVRLbBsri-v7c7rYirkAJHFrTn/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1789rdYveZ24UNBLcG_gQBIVOV7tXhrMe/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1YzA_8ZeKy8LEY6-Ls7OdUS1KfLFhcmdO/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/14ikzTWP8cg98y-ENrZYTc7R-zZRx9Ihm/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sejong-campus-highschool-branding-new',
    number: '10',
    title: '세종캠퍼스고등학교',
    subtitle: 'BRANDING DESIGN / Educational Identity',
    description: '세종캠퍼스고등학교의 비전과 정체성을 담은 통합 브랜딩 및 사인 시스템 디자인 프로젝트입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://drive.google.com/file/d/1YEKubcOsj_oOMKupu361nYHGSn-2NUeG/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1v7jrm1xo2YYpjrGrOxSha85u4NzqrwRQ/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1qr3Mzoar8zBRAV5eY2UsTvd6WRMpku2V/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/15-H9yVp3U5flQnxP5VohRp8a_c9yvvO6/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1LNWTDrWWCXS2I7dY04AzwlxL3ZZfdbky/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1cxJsB35A4-KsWGWUM3DaLcFhKXVYnELq/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1zZHxJwYRxMPCaylcRLM99TO2OaHoZRCc/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1EuAKK76PIwpjT_NVxzODBHDLX6rkaYRl/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1TuwYaSIsm3a6plZzqVGb7OYl9V8IJZHB/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1AEl-y5XfP3i6GudA0PmYtuWJqHlCnfDh/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1iBgFLK74LhR5s_uZahpjzTfOZWn7Y931/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'campus-highschool-evacuation-new',
    number: '01',
    title: '캠퍼스 고등학교 피난안내도',
    subtitle: 'VISUAL DESIGN / Information Design',
    description: '캠퍼스 고등학교 학생들의 안전을 위해 시인성을 높인 맞춤형 피난 안내도 디자인 및 제작 프로젝트입니다.',
    category: '시각디자인',
    thumbnail: 'https://drive.google.com/file/d/1ADwcpK-PaZeNP-Jc6DNYFWHQ2tlnZC0F/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1qufPkP9Rf_1YqH7tKzNaynwUvg-4VDjW/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1C0md6astJTnmD5jW_xC-RyRcHokkXiNF/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1T4H4h4Vxq9QIoXGwiJUUrQFBAvZnToSx/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sejong-campus-photozone-new',
    number: '02',
    title: '세종공동캠퍼스 포토존',
    subtitle: 'VISUAL DESIGN / Photo Zone',
    description: '세종공동캠퍼스 내 방문객들에게 특별한 추억을 선사하는 감각적인 포토존 공간 디자인 및 시각 연출 프로젝트입니다.',
    category: '시각디자인',
    thumbnail: 'https://drive.google.com/file/d/1lNPga8BncqZ9RYYYm-MSprM0pDe4VoYp/view?usp=drive_link',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'jongchon-disabled-center-visual-new',
    number: '03',
    title: '종촌장애인 보호작업장',
    subtitle: 'VISUAL DESIGN / Social Welfare',
    description: '종촌장애인 보호작업장의 따뜻한 가치를 담아낸 시각 디자인 및 홍보물 제작 프로젝트입니다.',
    category: '시각디자인',
    thumbnail: 'https://drive.google.com/file/d/1IAcu8G3uaLZjl7lmshqLNbFgkx2EzPhd/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1ISNf1uO_Eb--a-OGhN46sl5vxzPIcMA4/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'saerom-welfare-center-visual-new',
    number: '04',
    title: '새롬동 행정복지센터',
    subtitle: 'VISUAL DESIGN / Public Institution',
    description: '새롬동 행정복지센터의 공공 서비스 가치를 전달하는 시각 디자인 및 기관 브랜딩 프로젝트입니다.',
    category: '시각디자인',
    thumbnail: 'https://drive.google.com/file/d/1970rJCshXiG513sjho5CQjvgOjwPuFHP/view?usp=drive_link',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'gyeongseong-kindergarten-mockup-new',
    number: '05',
    title: '경성유치원 목업',
    subtitle: 'VISUAL DESIGN / Identity Mockup',
    description: '경성유치원의 브랜드 아이덴티티를 유치원 환경에 자연스럽게 녹여낸 토탈 시각 디자인 및 어플리케이션 목업 프로젝트입니다.',
    category: '시각디자인',
    thumbnail: 'https://drive.google.com/file/d/18-EvNIT_5m69BWb1mdhzqgB80tnY-p9z/view?usp=drive_link',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'masil-eung-bridge-mockup-new',
    number: '06',
    title: '마실가자 이응다리로 행사 목업',
    subtitle: 'VISUAL DESIGN / Festival Branding',
    description: '이응다리에서 진행된 마실가자 행사의 통합 브랜딩 및 홍보물 디자인 목업 프로젝트로, 행사의 분위기를 시각적으로 연출했습니다.',
    category: '시각디자인',
    thumbnail: 'https://drive.google.com/file/d/1Ko2iv1DlppPJvwxEx6UDIxrmEJFnpJeE/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1F0XYhGD0BG2dkKhDqS0PsGgqLXZA_OuH/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1CT7pLQslgPr8dpI3myAgZ5c_zUzaY3O-/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1-mn0_Jslyk1CcAbeWqJKzs02AIR7sVnN/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1Snt2L3mVxwbH9Rtk9nHoTUBjJepHpvXL/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sodam-general-meeting-mockup-new',
    number: '07',
    title: '23년 소담동주민총회 목업',
    subtitle: 'VISUAL DESIGN / Identity & Mockup',
    description: '2023년 소담동 주민총회의 브랜드 아이덴티티 시각화 및 주요 홍보물 디자인 목업 프로젝트입니다.',
    category: '시각디자인',
    thumbnail: 'https://drive.google.com/file/d/1JeueiYuhikDNwsNZl4cQETaH1kl-cpaA/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1ohLUoPPXq15Me8oTnLdW-5osbVvaUZzX/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/196tnZZo2aigGmpWcsivFtv2Q_bcHjo8D/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1bWThEpzsSwHV-bLmfFqDes07pfKfHju3/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1g_i6uSSmOVhSXtuY3Ia-SVYKYk9D6PrJ/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1s1U8MXncyqkmbGTwTTZBbR7B4LLIjGC7/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'saerom-forest-mockup-new',
    number: '08',
    title: '새롬동 상상의숲 행사 목업',
    subtitle: 'VISUAL DESIGN / Event Mockup',
    description: '새롬동 행정복지센터 상상의숲에서 진행된 행사의 테마를 시너지 있게 전달하기 위한 시각 디자인 및 현장 연출 목업 프로젝트입니다.',
    category: '시각디자인',
    thumbnail: 'https://drive.google.com/file/d/1vCSWZOBmziVX5jYmjEqYYnokfr00RaMy/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/16yPBaiXWnPoeVAXIsgHW1d3DEhKT6_Ko/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1eAUdkXj0F49IjgO3ksu2uhb8KOAVa0fR/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1M_wcVo4YvJwkZm7ud75YRRfxd5iBiQJ9/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'campus-planning-banner-new',
    number: '09',
    title: '공동캠퍼스 정책기획관 대형 외벽 현수막',
    subtitle: 'VISUAL DESIGN / Outdoor Media',
    description: '공동캠퍼스 정책기획관의 대형 외벽을 활용한 홍보 현수막 디자인으로, 시인성을 극대화한 비주얼 커뮤니케이션 프로젝트입니다.',
    category: '시각디자인',
    thumbnail: 'https://drive.google.com/file/d/1nZiH0cvwsLAHZgrBXxdJiImAkB3yBwpB/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1urrJjtMqAc1OzpZVRPNbPrHbtxE2AtIh/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1ymZl1egr3GR5MaccjGYOate9Kxo38Ql_/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1Z0EHmPGvDXVBSuuaTOi-RsVL7Tt2UD1I/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sejong-campus-visual-new',
    number: '10',
    title: '세종공동캠퍼스',
    subtitle: 'VISUAL DESIGN / Signage & Media',
    description: '세종공동캠퍼스의 아이덴티티를 강화하는 시각 프로젝트로, 대형 광고물 및 브랜딩 홍보 디자인을 포함한 종합 디자인입니다.',
    category: '시각디자인',
    thumbnail: 'https://drive.google.com/file/d/1iJZ1wCZ0XDHRVs5OlkxGETmQjf2aZxRH/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1fKc_PkpG6Umc0EOz6SABicqyZg9waMcp/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/18S8Vp6tYBhKovAewmJKBmSw2Bu-A1rrN/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'tipa-interior-new',
    number: '01',
    title: '중소기업기술정보진흥원',
    subtitle: 'INTERIOR DESIGN / Office Space',
    description: '중소기업기술정보진흥원(TIPA)의 전문성과 효율성을 고려한 사무 공간 인테리어 디자인 및 환경 개선 프로젝트입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://drive.google.com/file/d/16SgqxZhiorKx7rIkYYaEEdU-EbGJ6oFq/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1lwc1kTc2owfDCHlnRoAmcPSM_zzJ_sEZ/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1zTq0LyMKcPKIl2bSznfFV5pgwgco-idW/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'jeonui-community-gym-floor-new',
    number: '02',
    title: '전의면 복합커뮤니티센터 체력단련실 바닥공사',
    subtitle: 'INTERIOR DESIGN / Gym Flooring',
    description: '전의면 복합커뮤니티센터 내 체력단련실의 안전과 내구성을 고려한 전문 헬스장 바닥재 시공 프로젝트입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://drive.google.com/file/d/1dATdlUXNzSVr5yZlS_H_R0j7hb__ihws/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1zGSRuSCUAt5R64vsDYttYgCKqAGRzJcS/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1n2z7Uzjcom2g64g9NAs5iALUJqorhua1/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'kepco-signage-new',
    number: '03',
    title: '한국전력공사 세종SS 3개실 흡음판공사',
    subtitle: 'INTERIOR DESIGN / Acoustic Treatment',
    description: '한국전력공사 세종SS 시설 내 3개실의 정숙한 환경 조성을 위한 고성능 흡음판 시공 및 인테리어 개선 프로젝트입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://drive.google.com/file/d/1bRggcfOhzl29cfhCYnqlPFZWftTr1emu/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1KzzbZPrLQtu9rZniHsGQAnVZQITFAdRa/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1hsCBdmdaFX8T6p9tr2YL4j_IIqT2nwoN/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1QZdLnDVOWNlM4euZ4sRQvAC5QAa3ZsGq/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sejong-transit-blind-new',
    number: '04',
    title: '세종도시교통공사 롤블라인드',
    subtitle: 'INTERIOR DESIGN / Roll Blind Installation',
    description: '세종도시교통공사 사무 공간의 쾌적한 환경 조성을 위한 기능성 롤블라인드 설치 및 공간 스타일링 프로젝트입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://drive.google.com/file/d/1WXvTq1137nWulU2noz72Y0ymhZ0NUzN_/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1IrA8IVf3B5oXOS0c8BGItvQ1aE_26PcG/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1lMeccv9mDmJEr_oBQpLevu8RoROYjVf9/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1MHh5gTXiu6OHqebcmhNC_9tPSnjJPU29/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'south-sejong-youth-center-new',
    number: '05',
    title: '남세종청소년센터 공사',
    subtitle: 'INTERIOR DESIGN / Youth Center',
    description: '남세종청소년센터의 청소년들을 위한 창의적이고 안전한 공간 조성 및 인테리어 시공 프로젝트입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://drive.google.com/file/d/1pJwiqDpZlrFGawS5xIOX2XrGmBe5w9P_/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1p8pnic6g89LNpO2A9-y_z5AiDNSbMobj/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1pq3Ns9xeAcnqu8bGSJSvYJIA4chpu3lE/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sejong-transit-door-new',
    number: '06',
    title: '세종도시교통공사 양개형 방화문 공사',
    subtitle: 'INTERIOR DESIGN / Fire Door Installation',
    description: '세종도시교통공사 시설 내 안전 규격을 준수하는 고기능성 양개형 방화문 교체 및 시공 프로젝트입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://drive.google.com/file/d/1QBt7BBV_nLot_fD1zpc18sGO-yKcsmBV/view?usp=drive_link',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'first-village-6-pavilion-new',
    number: '07',
    title: '첫마을 6단지 정자 지붕보수 공사',
    subtitle: 'INTERIOR DESIGN / Facility Repair',
    description: '첫마을 6단지 내 주민 휴게 공간인 정자의 노후된 지붕을 보수하여 안전성과 미관을 개선한 시설 관리 프로젝트입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://drive.google.com/file/d/1-yCqz-zgoqRH8SvCuIKwpPeVyMDGp1cI/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1ES0_ToTotNpS_pR03tDJrtTbxk583_t0/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1xK_YmPTzzkk4shK71FoasQKQGLvuNRG9/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1qIHCnhPjIHFxbb1K64P4nC7kWQs09MF3/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'first-village-6-mold-new',
    number: '08',
    title: '첫마을 6단지 인테리어 필름 몰딩',
    subtitle: 'INTERIOR DESIGN / Interior Film',
    description: '첫마을 6단지 주거 공간의 몰딩 부분을 세련된 인테리어 필름으로 랩핑하여 현대적이고 깔끔한 분위기로 개선한 리모델링 프로젝트입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://drive.google.com/file/d/1dq4chKvhEnf8frcki28gpEo4qpODKpBv/view?usp=drive_link',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'klri-signage-new',
    number: '09',
    title: '한국법제연구원 호실 표찰',
    subtitle: 'INTERIOR DESIGN / Signage',
    description: '한국법제연구원 청사 내 각 실의 용도를 명확히 안내하고 공간의 품격을 더하는 현대적인 호실 표찰 디자인 및 제작 프로젝트입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://drive.google.com/file/d/1u-Cg88VULU44a7Hjki4tSiWaXX-iFGl5/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1Kd77ireq9kEdA5lk6dHt12412vbrWs5N/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1Plw6FPSzmOxkvScXukQmlp5LolumAUnD/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1ZV9ylpcx8_Q3YSFOCDblddfBBqWVOCqa/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'urban-appel-entrance-new',
    number: '10',
    title: '어반아펠 세대현관문 시공',
    subtitle: 'INTERIOR DESIGN / Door Installation',
    description: '어반아펠 단지의 세대별 현관문 교체 및 시공 프로젝트로, 주거 공간의 첫인상을 결정짓는 현대적인 도어 솔루션을 제공했습니다.',
    category: '인테리어디자인',
    thumbnail: 'https://drive.google.com/file/d/1m6f1fbcLZY9SX8MdMmT3xEhoRHc2lQV3/view?usp=drive_link',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'air-rail-investigation-new',
    number: '11',
    title: '항공철도사고조사위원회',
    subtitle: 'INTERIOR DESIGN / Office Space',
    description: '항공철도사고조사위원회의 전문성과 상징성을 극대화한 오피스 공간 인테리어 디자인 및 시공 프로젝트입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://drive.google.com/file/d/1Xw-wg5fZq3wMTWNSiOiN5tfLCW5AzotO/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1G316nkR0BLCl6TSPtFXKDQYU7Tr1Eddb/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'jeondong-community-center-space',
    number: '12',
    title: '전동면 복합커뮤니티센터 마주침공간',
    subtitle: 'INTERIOR DESIGN / Community Space',
    description: '지역 주민들이 편하게 소통하고 어우러질 수 있는 전동면 복합커뮤니티센터 내 마주침 공간의 인테리어 기획 및 시공 프로젝트입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://drive.google.com/file/d/1fQfSuJesM1wk6f1QXgHjzXd42R4KIkHc/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1adKxKb75djNGjlTvLrxoxBtUT4ltMBay/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1ZvctzlSQuUnTU1U_UHS50BYdNTc-KtCM/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1MPhbfY6FdXI23U_4eEKtyZVHS3yb1ieg/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sejong-health-center-desk',
    number: '13',
    title: '세종시보건소 안내데스크',
    subtitle: 'INTERIOR DESIGN / Reception',
    description: '세종시보건소 방문객 편의와 브랜드 가치를 높이는 메인 안내데스크 공간 리뉴얼 및 인테리어 디자인 프로젝트입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://drive.google.com/file/d/1jhDAZGiiOvLNLLJpmu2uVI6Ebm8CJPNZ/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1gXwNeY5MbMK_wz0Bn8h9KyTjziO0VHA1/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'seoul-hyeon-walking-new',
    number: '01',
    title: '서울현병원 걷기대회 행사',
    subtitle: 'EVENT DESIGN / Health & Community',
    description: '지역 주민의 건강 증진을 위해 서울현병원이 주최한 걷기대회의 홍보 브랜딩 및 행사 부스 연출 디자인 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://drive.google.com/file/d/12CYM_Qiw7dHBFkir1kYyU-7zIW4Q3bXH/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1Oty6Dh2d4xIPmZMBcyTo7hoTM0PHIact/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1paDm0p1BwhCrcyuTEGSBGSXLMxGzAZFi/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sejong-recycling-exhibit-new',
    number: '02',
    title: '세종재활용센터 전시행사',
    subtitle: 'EVENT DESIGN / Environment & Exhibition',
    description: '환경 보호와 자원 순환의 중요성을 알리는 세종재활용센터의 전시 행사 기획 및 부스 디자인 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://drive.google.com/file/d/1pipB3Z_qT8l2MrMO_sCOkAAJTLAlT5eN/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/14zOwbQw3FcCbJg9JXqdSzPaAMOQUxZU3/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1mggd4NE_Wgj5gX5lk95EK2MLWgL4AYLj/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'singsing-market-festa-new',
    number: '03',
    title: '싱싱장터 모농모농페스타',
    subtitle: 'EVENT DESIGN / Local Market Festival',
    description: '지역 농산물 활성화를 위한 싱싱장터 모농모농페스타의 활기차고 창의적인 행사 공간 기획 및 브랜딩 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://drive.google.com/file/d/1vsO0qQ2MpgM_jUFnWnrHzDMNPz9NFHVG/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1cllOAztmT5mCXP40GD6vYDlJj7dV5m3I/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'hangeul-expo-new',
    number: '04',
    title: '한글상품박람회',
    subtitle: 'EVENT DESIGN / Exhibition & Culture',
    description: '한글의 아름다움과 창의적 가치를 알리는 한글상품박람회의 전시 공간 기획 및 연출 디자인 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://drive.google.com/file/d/1xD-BweMjSl38nqic-bAOPZjR15StWZO7/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1_eznVjmZ1cKHaYcKMq52njB3dxQvnCmT/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'smart-innovation-new',
    number: '05',
    title: '한국스마트혁신기업가협회',
    subtitle: 'EVENT DESIGN / Corporate Event',
    description: '한국스마트혁신기업가협회의 주요 행사 기획 및 브랜딩, 조화로운 공간 연출 디자인 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://drive.google.com/file/d/150otZa997_3IPOFwYfgCZLRUZaZKNxeV/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1ZBVNBZW3JxU4LnKwv9BamFlLtnPIN8Q2/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'kdhc-event-new',
    number: '06',
    title: '한국지역난방공사 행사',
    subtitle: 'EVENT DESIGN / Corporate Event',
    description: '한국지역난방공사의 기업 행사 기획 및 비주얼 디자인, 브랜드 아이덴티티를 살린 현장 연출 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://drive.google.com/file/d/1ttVxYWk5KUj31ZKXdgAS723eBWEI7_hw/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1NTkGBsdlTRs8R7Lrn1jKeiX68SyIZSn1/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1Pd1QRY6zF6Gg-Q0JocQQhSz55VfV0LeB/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/18Zl7cap0ROyv36Vc9E2YBA7ZgxYhaZ1c/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'kospo-ceremony-new',
    number: '07',
    title: '한국남부발전 신세종빛드림 준공기념식',
    subtitle: 'EVENT DESIGN / Corporate Ceremony',
    description: '한국남부발전 신세종빛드림 본부의 준공을 축하하는 기념식 행사 기획 및 총괄 운영, 메인 무대와 공간 연출 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://drive.google.com/file/d/1YWGZomGkSo-8tDJ3bZ85UTq8AU99A-kU/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1szN_HJZe3u5jtAsZTc0e2_PU4-lKgCqx/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'dajeong-water-fest-new',
    number: '08',
    title: '다정동 행정복지센터 물놀이 축제 행사',
    subtitle: 'EVENT DESIGN / Community Festival',
    description: '다정동 주민들을 위한 여름 물놀이 축제 행사 기획 및 안전한 공간 구성, 현장 분위기를 고조시키는 조형물 설치 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://drive.google.com/file/d/16sP6YiB4fiP_LvROsFb8j6XYg6i3MOwE/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1p2RhMO4uwW1VLv6XrQbeDWSj212YvhCb/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/10T3FqYdtWdntxo0B0ELUnCtze7HAoMyk/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1nkj9sqPQ5tkZX-v07aiZeDxXcKN9qY1Z/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'edu-office-booth-new',
    number: '09',
    title: '교육청 전시행사 부스',
    subtitle: 'EVENT DESIGN / Exhibition Booth',
    description: '교육청 주관 전시 행사를 위한 특수 부스 설계 및 시공 프로젝트로, 공간 활용도를 극대화한 전시 연출 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://drive.google.com/file/d/1MpyfzRbBnZP-4r4kLbanCOVdK_6Uw3Fo/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1ePram5_tcdcyBVCGpHyBcglT18UE7VRV/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1OfB_bImLy1x1QpNFFUWD54tF7ZBEwxiN/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'childfund-event-new',
    number: '10',
    title: '초록우산 어린이재단 행사',
    subtitle: 'EVENT DESIGN / Charity & Social Value',
    description: '초록우산 어린이재단의 나눔 가치를 전달하기 위한 행사 기획 및 비주얼 아이덴티티, 공간 연출 총괄 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://drive.google.com/file/d/1TBmZzslxGStDBjov8N11kK9CuOqTNQOF/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1cNoHqXE07OiEzrKrNAkxNIAkDLYQ_l-3/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1Rr-lPJwB4GmnydgJIRi5Zi3ziaQjYbUe/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'hansol-baekje-new',
    number: '11',
    title: '한솔백제문화축제',
    subtitle: 'EVENT DESIGN / Cultural Festival',
    description: '한솔동의 역사와 전통을 기리는 백제문화축제의 총괄 행사 디자인 및 홍보물 제작 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://drive.google.com/file/d/176j8E7kfCWkdIwLMOKGeD8nepUXolfUv/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/11zWtU_rU6Tt5HU165uZk0dkkG14S6uSA/view?usp=drive_link' },
      { url: 'https://drive.google.com/file/d/1osLGuKYSvGwENsmkelG-vl4jOQeIkuIW/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'saerom-forest-new',
    number: '12',
    title: '새롬동 행정복지센터 상상의 숲',
    subtitle: 'EVENT DESIGN / Exhibition Space',
    description: '새롬동 행정복지센터 내 상상의 숲 공간에서 진행된 창의적 전시 기획 및 공간 연출 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://drive.google.com/file/d/1UaxCuo_A3Klj3H1C34zyKuCLO281JNGU/view?usp=drive_link',
    images: [
      { url: 'https://drive.google.com/file/d/1EXHyEyVAXUrZ45Z_huqFmlvvESJMBWHx/view?usp=drive_link' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'chochiwon-ceremony-new',
    number: '13',
    title: '조치원읍 복합커뮤니티센터 준공식',
    subtitle: 'EVENT DESIGN / Ceremony',
    description: '조치원읍 복합커뮤니티센터의 성공적인 준공을 기념하는 행사 기획 및 총괄 운영, 공간 연출 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://lh3.googleusercontent.com/d/1H-pS5AJshzraCo9hG10OZdBlXIC4Btj_=s1600',
    images: [
      { url: 'https://lh3.googleusercontent.com/d/1H-pS5AJshzraCo9hG10OZdBlXIC4Btj_=s1600' }
    ],
    createdAt: new Date().toISOString()
  }
];

// --- Utilities ---
const getDirectImageUrl = (url: string) => {
  if (!url) return '';
  const driveRegex = /(?:drive\.google\.com\/file\/d\/|docs\.google\.com\/uc\?id=|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}=s1600`;
  }
  return url;
};

const MarqueeImages = ({ images, index }: { images: string[]; index: number }) => {
  const isEvenRow = index % 2 !== 0; // index 0,2,4 are 1st, 3rd, 5th rows. 1,3 are 2nd, 4th.
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 transition-opacity duration-700 group-hover:opacity-60">
      <motion.div
        className="flex gap-4 h-full items-center"
        animate={{
          x: isEvenRow ? [-500, -1500] : [0, -1000],
        }}
        transition={{
          duration: isEvenRow ? 30 : 20, // 2nd, 4th rows are slower
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...images, ...images, ...images].map((src, idx) => (
          <img
            key={idx}
            src={getDirectImageUrl(src)}
            alt="Project preview"
            className="h-[90%] aspect-video object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        ))}
      </motion.div>
    </div>
  );
};

const ProjectItem: React.FC<{ 
  project: Project; 
  onClick: (project: Project) => void; 
}> = ({ project, onClick }) => {
  return (
    <motion.div
      className="group relative aspect-square overflow-hidden cursor-pointer bg-gray-100 rounded-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
      onClick={() => onClick(project)}
    >
      {/* Main Thumbnail */}
      <img 
        src={getDirectImageUrl(project.thumbnail)} 
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-brand-green/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center text-white">
        <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight mb-2 leading-tight break-keep">
          {project.title}
        </h3>
        <p className="text-[7px] md:text-[8px] font-medium tracking-widest uppercase opacity-80">
          {project.subtitle}
        </p>
        
        <div className="mt-6 w-8 h-8 rounded-full border border-white/30 flex items-center justify-center">
          <ArrowUpRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

const ProjectDetailModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="fixed top-6 right-6 z-[210] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
      >
        <X size={24} />
      </button>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 md:p-12 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-green/40 mb-2 block">
                {project.category}
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-brand-green break-keep">
                {project.title}
              </h2>
              <p className="mt-4 text-sm md:text-base text-brand-green/60 max-w-xl leading-relaxed font-bold break-keep">
                {project.subtitle}
              </p>
              {project.description && (
                <p className="mt-2 text-xs md:text-sm text-brand-green/50 max-w-xl leading-relaxed italic break-keep">
                  {project.description}
                </p>
              )}
            </div>
            <div className="text-[10px] font-bold tracking-widest uppercase opacity-40">
              Project No. {project.number}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-12 space-y-8">
          {/* Main Thumbnail */}
          <div className="w-full aspect-video rounded-sm overflow-hidden bg-gray-50">
            <img 
              src={getDirectImageUrl(project.thumbnail)} 
              alt={project.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Gallery Intro */}
          {project.galleryIntro && (
            <div className="max-w-2xl mx-auto py-4">
              <p className="text-sm md:text-base text-brand-green/80 leading-relaxed text-center font-medium whitespace-pre-wrap break-keep">
                {project.galleryIntro}
              </p>
            </div>
          )}

          {/* Gallery */}
          {project.images && project.images.length > 0 && (
            <div className="grid grid-cols-1 gap-12">
              {project.images.map((imgObj, idx) => (
                <React.Fragment key={idx}>
                  <div className="space-y-4">
                    <div className="w-full rounded-sm overflow-hidden bg-gray-50">
                      <img 
                        src={getDirectImageUrl(imgObj.url)} 
                        alt={`${project.title} gallery ${idx + 1}`} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {imgObj.caption && (
                      <p className="text-center text-xs md:text-sm text-brand-green/60 font-medium tracking-tight whitespace-pre-wrap break-keep">
                        {imgObj.caption}
                      </p>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Gallery Outro */}
          {project.galleryOutro && (
            <div className="max-w-2xl mx-auto py-4 border-t border-gray-100 pt-12">
              <p className="text-sm md:text-base text-brand-green/80 leading-relaxed text-center font-medium whitespace-pre-wrap break-keep">
                {project.galleryOutro}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 md:p-12 bg-gray-50 flex justify-center">
          <button 
            onClick={onClose}
            className="px-10 py-4 bg-brand-green text-white font-bold tracking-widest uppercase text-xs rounded-full hover:scale-105 transition-transform"
          >
            Close Project
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    if (!isConfigValid || !db) {
      setIsLoading(false);
      return;
    }
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetched: Project[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Project);
      });
      setDbProjects(fetched);
    } catch (e) {
      console.error("Error fetching projects: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const projects = dbProjects.length > 0 ? dbProjects : SAMPLE_PROJECTS;

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-brand-green selection:bg-brand-green selection:text-white">
      {/* Modals */}
      <AnimatePresence>
        {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 md:px-10">
        <div className="max-w-screen-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-10">
              {selectedCategory && (
                <motion.button 
                  onClick={() => {
                    setSelectedCategory(null);
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="text-[15px] md:text-lg font-bold tracking-widest uppercase opacity-60 hover:opacity-100 transition-all flex items-center gap-4 group mb-8"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  whileHover={{ x: -4 }}
                >
                  <div className="w-12 h-12 rounded-full border border-brand-green/20 flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-all">
                    <ArrowUpRight className="w-6 h-6 rotate-[225deg]" />
                  </div>
                  BACK TO 작업물
                </motion.button>
              )}
            </div>
            <h1 className="text-[21px] md:text-[4.2vw] font-display font-black leading-[0.85] tracking-tighter uppercase mb-2 relative inline-block break-keep">
              {selectedCategory || '작업물'}
              <motion.div 
                className="absolute -bottom-4 left-0 h-[2px] bg-[#D4AF37]"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-40 min-h-[400px]">
        {isLoading && dbProjects.length === 0 ? (
          <div className="flex justify-center p-20 opacity-20 font-mono text-[10px] uppercase tracking-widest">Loading...</div>
        ) : !selectedCategory ? (
          // Category List
          <div className="flex flex-col">
            {CATEGORIES.map((cat, idx) => {
              const catProjects = projects.filter(p => p.category === cat);
              const previewImages = catProjects.length > 0 
                ? catProjects.map(p => p.thumbnail)
                : ['https://picsum.photos/seed/empty/800/600'];

              return (
                <motion.div
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="group relative w-full border-b border-brand-green/10 overflow-hidden cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <MarqueeImages images={previewImages} index={idx} />
                  <div className="relative z-10 flex items-center justify-between py-10 px-6 md:px-12 transition-transform duration-500 group-hover:translate-x-4">
                    <div className="flex items-baseline gap-8 md:gap-16">
                      <div className="flex flex-col">
                        <h2 className="text-[17px] md:text-[34px] lg:text-[42px] font-display font-black leading-none tracking-tighter transition-all duration-500 break-keep">
                          {cat}
                        </h2>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-brand-green/20 group-hover:bg-brand-green group-hover:text-white transition-all duration-500">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Project List for Selected Category
          <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {projects.filter(p => p.category === selectedCategory).length > 0 ? (
                projects
                  .filter(p => p.category === selectedCategory)
                  .map((project) => (
                    <ProjectItem 
                      key={project.id} 
                      project={project} 
                      onClick={setSelectedProject}
                    />
                  ))
              ) : (
                <div className="col-span-full flex justify-center p-20 opacity-20 font-mono text-[10px] uppercase tracking-widest">No projects in this category.</div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-brand-green text-white p-10 md:p-20">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 md:gap-20">
            {/* Brand Section */}
            <div className="lg:col-span-4 space-y-6">
              <button 
                onClick={() => {
                  if (selectedCategory) {
                    setSelectedCategory(null);
                  }
                }}
                className="font-display text-[27px] md:text-[32px] tracking-tighter text-left outline-none"
              >
                DABIN GROUP
              </button>
              <p className="text-xs md:text-sm leading-relaxed opacity-70 font-light max-w-sm">
                다빈그룹은 광고, 행사기획, 인쇄편집 분야에서 최고의 전문성을 바탕으로 고객사의 가치를 극대화하는 결과 중심의 파트너 입니다.
              </p>
            </div>

            {/* Contact Section */}
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#D4AF37]">Contact</h4>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest opacity-40">Phone</p>
                    <p className="text-sm md:text-base font-medium">044-715-5636</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest opacity-40">Email</p>
                    <p className="text-sm md:text-base font-medium opacity-80">dabin_0408@naver.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Locations Section */}
            <div className="lg:col-span-4 space-y-8">
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#D4AF37]">찾아오시는 길</h4>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1">세종본사</p>
                    <p className="text-[11px] opacity-60 leading-relaxed">
                      세종특별자치시 금남면 용포로 110 2층<br />
                      세종특별자치시 집현중앙7로 6 801호(지식산업센터)
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1">대전지사</p>
                    <p className="text-[11px] opacity-60 leading-relaxed">
                      대전광역시 서구 둔산로 45,엠빌딩 3층
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest mb-1">충남지사</p>
                      <p className="text-[11px] opacity-60 leading-relaxed">충남 천안시 불당동 789</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest mb-1">충북지사</p>
                      <p className="text-[11px] opacity-60 leading-relaxed">충북 청주시 가경동 456</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[9px] tracking-widest uppercase opacity-30">
              © 2024 DABIN GROUP. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>

      {/* KakaoTalk Inquiry Button */}
      <motion.a
        href="https://pf.kakao.com/_xxxx" // Replace with actual KakaoTalk channel link
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] bg-[#FEE500] text-[#3C1E1E] px-6 py-3 rounded-full font-bold text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4 }}
      >
        <div className="w-5 h-5 bg-[#3C1E1E] rounded-full flex items-center justify-center">
          <span className="text-[#FEE500] text-[10px]">K</span>
        </div>
        카카오톡 문의하기
      </motion.a>
    </div>
  );
}
