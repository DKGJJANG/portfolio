/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, Lock, LogOut, Plus, Trash2, Edit } from 'lucide-react';
import { auth, db, isConfigValid } from './lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  getDoc,
  addDoc
} from 'firebase/firestore';

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
    id: 'sample-59',
    number: '01',
    title: '세종공동캠퍼스 외벽현수막 및 포토존',
    subtitle: 'PUBLIC DESIGN / Signage & Photozone',
    description: '세종공동캠퍼스 내외부의 시각적 활력을 위한 대형 외벽 현수막 및 방문객 포토존 디자인 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public16/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-58',
    number: '02',
    title: '캠퍼스고등학교 피난안내도',
    subtitle: 'PUBLIC DESIGN / Safety Map',
    description: '캠퍼스고등학교 내 안전 사고 예방을 위한 가독성 높은 피난 안내도 디자인 및 제작 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public15/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-57',
    number: '03',
    title: '세종도시교통공사 국기계양대',
    subtitle: 'PUBLIC DESIGN / Installation',
    description: '세종도시교통공사 청사 앞 국기 및 기관기 계양 시스템 설치 및 주변 환경 정비 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public14/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-56',
    number: '04',
    title: '세종도시교통공사 어울링 대여소',
    subtitle: 'PUBLIC DESIGN / Mobility Station',
    description: '세종시 공영자전거 어울링 대여소의 시인성 개선 및 주변 안내 사이니지 디자인 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public13/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-55',
    number: '05',
    title: '연동면사무소 게시판',
    subtitle: 'PUBLIC DESIGN / Information Board',
    description: '연동면사무소 입구의 주민 소통을 위한 공공 안내 게시판 디자인 및 제작 설치 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public12/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-54',
    number: '06',
    title: '플랜투플랜 실내간판',
    subtitle: 'PUBLIC DESIGN / Interior Sign',
    description: '플랜투플랜 사무실 내 기업 정체성을 강조한 고품격 실내 사이니지 디자인 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public11/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-53',
    number: '07',
    title: '보훈심사위원회 채널간판',
    subtitle: 'PUBLIC DESIGN / LED Signage',
    description: '국가보훈부 보훈심사위원회 청사의 시인성 확보를 위한 야간 LED 채널 간판 제작 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public10/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-52',
    number: '08',
    title: '이엔코퍼레이션 간판 및 지주간판',
    subtitle: 'PUBLIC DESIGN / Corporate Sign',
    description: '이엔코퍼레이션 본사 사옥의 인지도를 높이기 위한 건물 외벽 간판 및 외부 지주 간판 디자인입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public9/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-51',
    number: '09',
    title: '세종문화예술회관 지주간판 및 입간판',
    subtitle: 'PUBLIC DESIGN / Wayfinding',
    description: '세종문화예술회관 내외부 방문객 유도를 위한 안내 지주 간판 및 이동식 입간판 디자인 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public8/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-50',
    number: '10',
    title: '대평동주민센터 조형물',
    subtitle: 'PUBLIC DESIGN / Sculpture',
    description: '대평동 주민센터 야외 광장의 지역적 특색을 담은 예술적 랜드마크 조형물 디자인 및 설치입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public7/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-49',
    number: '11',
    title: '용포로 간판개선사업',
    subtitle: 'PUBLIC DESIGN / Street Renewal',
    description: '금남면 용포로 일대의 노후된 간판을 정비하여 도시 미관을 개선하고 상권을 활성화하는 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public6/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-48',
    number: '12',
    title: '전의면 복합커뮤니티센터 사인시스템',
    subtitle: 'PUBLIC DESIGN / Signage System',
    description: '전의면 복합커뮤니티센터 내부 공간 안내를 위한 통합 웨이파인딩 시스템 디자인 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public5/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-47',
    number: '13',
    title: '한국농어촌공사 사인시스템',
    subtitle: 'PUBLIC DESIGN / Corporate Identity',
    description: '한국농어촌공사 지사 및 현장 안내를 위한 표준화된 공공 사인 가이드라인 및 제작 설치입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public4/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-46',
    number: '14',
    title: '세종문화회관 사인시스템',
    subtitle: 'PUBLIC DESIGN / Cultural Space',
    description: '세종문화회관의 격조 있는 문화 예술 공간 분위기에 맞춘 내부 안내 사이니지 디자인 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public3/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-45',
    number: '15',
    title: '사랑의 열매 온도탑',
    subtitle: 'PUBLIC DESIGN / Symbolic Object',
    description: '연말연시 나눔 문화를 상징하는 사랑의 열매 온도탑의 조형물 디자인 및 시각화 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public2/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-44',
    number: '16',
    title: '국립세종수목원 사인시스템',
    subtitle: 'PUBLIC DESIGN / Environmental Graphic',
    description: '국립세종수목원의 자연 경관과 조화되는 친환경적 안내 시스템 및 환경 그래픽 디자인입니다.',
    category: '공공디자인',
    thumbnail: 'https://picsum.photos/seed/public1/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-43',
    number: '17',
    title: '세이로정',
    subtitle: 'BRANDING / Logo & Identity',
    description: '세이로무시 전문점 세이로정의 정갈하고 고급스러운 브랜드 아이덴티티 및 로고 디자인 프로젝트입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://picsum.photos/seed/food10/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-42',
    number: '02',
    title: '나성FC',
    subtitle: 'BRANDING / Sports Identity',
    description: '나성FC 축구 클럽의 역동적이고 단결된 이미지를 상징하는 엠블럼 및 팀 브랜딩 프로젝트입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://picsum.photos/seed/sports9/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-41',
    number: '03',
    title: '올스타배팅센터',
    subtitle: 'BRANDING / Sports Facility',
    description: '스포츠 엔터테인먼트 공간 올스타배팅센터의 활력 넘치는 브랜드 로고 및 공간 그래픽 디자인입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://picsum.photos/seed/baseball8/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-40',
    number: '04',
    title: '다올팜스튜디오',
    subtitle: 'BRANDING / Studio Identity',
    description: '자연 친화적 감성을 담은 다올팜스튜디오의 브랜드 스토리텔링 및 시각적 아이덴티티 구축 프로젝트입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://picsum.photos/seed/farm7/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-39',
    number: '05',
    title: '나성유치원',
    subtitle: 'BRANDING / Education',
    description: '아이들의 창의성과 꿈을 담은 나성유치원의 따뜻하고 친근한 교육 브랜드 디자인 프로젝트입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://picsum.photos/seed/edu6/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-38',
    number: '06',
    title: '세종교사노동조합',
    subtitle: 'BRANDING / Organization',
    description: '교육의 가치와 교권 보호를 상징하는 세종교사노동조합의 신뢰감 있는 CI 및 브랜딩 프로젝트입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://picsum.photos/seed/union5/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-37',
    number: '07',
    title: '이자카야 범',
    subtitle: 'BRANDING / Logo Design',
    description: '이자카야 범(BUM)의 강렬하면서도 세련된 동양적 무드를 강조한 로고 및 브랜드 경험 디자인입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://picsum.photos/seed/tiger4/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-36',
    number: '08',
    title: '타로모나드',
    subtitle: 'BRANDING / Identity',
    description: '심리 상담과 타로의 신비로운 감성을 현대적으로 재해석한 타로모나드 브랜드 디자인 프로젝트입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://picsum.photos/seed/tarot3/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-35',
    number: '09',
    title: '온세종고등학교',
    subtitle: 'BRANDING / School Identity',
    description: '스마트 교육의 미래를 지향하는 온세종고등학교의 혁신적인 학교 UI 및 브랜드 시스템 구축입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://picsum.photos/seed/school2/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-34',
    number: '10',
    title: '세종캠퍼스 고등학교',
    subtitle: 'BRANDING / Education',
    description: '세종캠퍼스 고등학교의 교육 철학을 시각화한 로고 디자인 및 통합 안내 시스템 브랜딩입니다.',
    category: '브랜딩디자인',
    thumbnail: 'https://picsum.photos/seed/school1/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-33',
    number: '11',
    title: '마실가자 이응다리로 행사 목업',
    subtitle: 'VISUAL DESIGN / Mockup',
    description: '이응다리 마실 가기 행사 홍보를 위한 통합 시각물 디자인 및 현장 적용 목업 프로젝트입니다.',
    category: '시각디자인',
    thumbnail: 'https://picsum.photos/seed/mockup3/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-32',
    number: '02',
    title: '23년 소담동주민총회 목업',
    subtitle: 'VISUAL DESIGN / Mockup',
    description: '2023년 소담동 주민총회의 브랜드 아이덴티티 시각화 및 주요 홍보물 디자인 목업입니다.',
    category: '시각디자인',
    thumbnail: 'https://picsum.photos/seed/mockup2/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-31',
    number: '03',
    title: '새롬동 상상의 숲 행사 목업',
    subtitle: 'VISUAL DESIGN / Mockup',
    description: '새롬동 상상의 숲 축제의 테마를 반영한 그래픽 디자인 및 이벤트 베뉴 목업 프로젝트입니다.',
    category: '시각디자인',
    thumbnail: 'https://picsum.photos/seed/mockup1/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-30',
    number: '04',
    title: '공동캠퍼스 정책기획관 대형 외벽 현수막',
    subtitle: 'VISUAL DESIGN / Outdoor Media',
    description: '세종공동캠퍼스 정책기획관 외벽에 설치된 대형 홍보 현수막 디자인 및 시뮬레이션 프로젝트입니다.',
    category: '시각디자인',
    thumbnail: 'https://picsum.photos/seed/banner2/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-29',
    number: '05',
    title: '세종공동캠퍼스 외벽 현수막',
    subtitle: 'VISUAL DESIGN / Banner',
    description: '세종공동캠퍼스 건물의 시인성을 높이기 위한 외벽 디자인 현수막 제작 프로젝트입니다.',
    category: '시각디자인',
    thumbnail: 'https://picsum.photos/seed/banner1/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-28',
    number: '06',
    title: '중소기업기술정보진흥원 가벽공사',
    subtitle: 'INTERIOR DESIGN / Partition',
    description: '중소기업기술정보진흥원 사무 공간 효율화를 위한 가벽 설치 및 공간 분할 공사입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://picsum.photos/seed/partition/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-27',
    number: '02',
    title: '전의면 복합커뮤니티센터 체력단련실 바닥공사',
    subtitle: 'INTERIOR DESIGN / Flooring',
    description: '전의면 복합커뮤니티센터 내 체력단련실의 안전하고 내구성 높은 전문 바닥재 시공 공사입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://picsum.photos/seed/gym/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-26',
    number: '03',
    title: '한국전력공사 세종SS 3개실 흡음판 설치',
    subtitle: 'INTERIOR DESIGN / Acoustic',
    description: '한국전력공사 세종SS 내 전력 제어실 및 회의실 소음 저감을 위한 고성능 흡음판 설치 공사입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://picsum.photos/seed/acoustic/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-25',
    number: '04',
    title: '세종도시교통공사 롤블라인드',
    subtitle: 'INTERIOR DESIGN / Window Treatment',
    description: '세종도시교통공사 사무 및 휴게 공간의 채광 조절과 프라이버시 보호를 위한 롤블라인드 설치입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://picsum.photos/seed/blind/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-24',
    number: '05',
    title: '남세종청소년센터 공사',
    subtitle: 'INTERIOR DESIGN / Youth Center',
    description: '남세종청소년센터 내 활동 공간 및 사무 공간의 기능 개선을 위한 인테리어 공사 프로젝트입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://picsum.photos/seed/youth/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-23',
    number: '06',
    title: '세종도시교통공사 양개형 방화문 공사',
    subtitle: 'INTERIOR DESIGN / Fire Door',
    description: '세종도시교통공사 시설 내 소방 안전 규정 준수를 위한 양개형 방화문 교체 및 보수 공사입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://picsum.photos/seed/firedoor/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-22',
    number: '07',
    title: '첫마을 6단지 정자 지붕보수 공사',
    subtitle: 'INTERIOR DESIGN / Restoration',
    description: '첫마을 6단지 내 주민 휴게 공간인 정자의 노후된 지붕재 교체 및 구조 보강 공사입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://picsum.photos/seed/roof/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-21',
    number: '08',
    title: '첫마을 6단지 인테리어 필름 몰딩',
    subtitle: 'INTERIOR DESIGN / Refurbishment',
    description: '첫마을 6단지 세대 내 몰딩 및 가구 부위의 인테리어 필름 시공을 통한 프리미엄 리모델링입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://picsum.photos/seed/film/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-20',
    number: '09',
    title: '법제연구원 호실 표찰',
    subtitle: 'INTERIOR DESIGN / Signage',
    description: '한국법제연구원 내 각 연구실 및 사무실의 가독성 높은 호실 표찰 디자인 및 제작 설치입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://picsum.photos/seed/sign/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-19',
    number: '10',
    title: '어반아펠 세대현관문',
    subtitle: 'INTERIOR DESIGN / Entrance',
    description: '어반아펠 주거 단지 세대별 현관문의 디자인 개선 및 보안성 강화를 위한 교체 시공 공사입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://picsum.photos/seed/door/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-18',
    number: '11',
    title: '전동면 복합커뮤니티센터 마주침 공간',
    subtitle: 'INTERIOR DESIGN / Community Space',
    description: '전동면 복합커뮤니티센터 내 주민들이 자유롭게 소통할 수 있는 오픈 라운지 및 마주침 공간 디자인입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://picsum.photos/seed/community/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-17',
    number: '12',
    title: '세종시보건소 안내데스크',
    subtitle: 'INTERIOR DESIGN / Reception',
    description: '세종시보건소 방문객 편의를 위한 메인 로비 안내데스크 및 대기 공간 리뉴얼 디자인 프로젝트입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://picsum.photos/seed/reception/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-16',
    number: '13',
    title: '항공철도 사고조사위원회 출입구',
    subtitle: 'INTERIOR DESIGN / Entrance',
    description: '항공철도 사고조사위원회 청사 출입구의 보안 및 디자인을 고려한 인테리어 개선 공사입니다.',
    category: '인테리어디자인',
    thumbnail: 'https://picsum.photos/seed/office/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-15',
    number: '14',
    title: '서울현병원 걷기대회',
    subtitle: 'EVENT DESIGN / Sport Event',
    description: '서울현병원 가족 걷기대회 행사 디자인 및 운영 지원 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://picsum.photos/seed/walk/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-14',
    number: '02',
    title: '세종재활용센터 전시행사 설치',
    subtitle: 'EVENT DESIGN / Exhibition',
    description: '세종재활용센터 자원순환 홍보를 위한 전시 부스 디자인 및 설치 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://picsum.photos/seed/recycle/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-13',
    number: '03',
    title: '싱싱장터 모농모농페스타',
    subtitle: 'EVENT DESIGN / Local Market',
    description: '싱싱장터 로컬푸드 축제 모농모농페스타 행사 기획 및 디자인 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://picsum.photos/seed/market/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-12',
    number: '04',
    title: '한글상품 박람회',
    subtitle: 'EVENT DESIGN / Fair',
    description: '한글 문화 상품의 가치를 알리는 박람회 통합 디자인 솔루션 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://picsum.photos/seed/fair/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-11',
    number: '05',
    title: '한국스마트혁신기업가협회 행사',
    subtitle: 'EVENT DESIGN / Association',
    description: '한국스마트혁신기업가협회 정기 세미나 및 네트워킹 데이 디자인 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://picsum.photos/seed/smart/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-10',
    number: '06',
    title: '한국지역난방공사 설치',
    subtitle: 'EVENT DESIGN / Installation',
    description: '한국지역난방공사 홍보관 정비 및 행사 관련 설치물 디자인 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://picsum.photos/seed/heat/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-9',
    number: '07',
    title: '한국남부발전 신세종빛드림 준공기념식',
    subtitle: 'EVENT DESIGN / Ceremony',
    description: '한국남부발전 신세종빛드림본부 준공 기념식 행사 기획 및 디자인 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://picsum.photos/seed/power/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-8',
    number: '08',
    title: '다정동행정복지센터 물놀이 축제',
    subtitle: 'EVENT DESIGN / Summer Festival',
    description: '다정동 주민들을 위한 도심 속 물놀이 축제 공간 디자인 및 기획 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://picsum.photos/seed/water/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-7',
    number: '09',
    title: '교육청 전시행사 부스 재시공',
    subtitle: 'EVENT DESIGN / Exhibition',
    description: '교육청 주관 전시 행사 부스의 창의적인 공간 재구성 및 시공 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://picsum.photos/seed/edu/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-6',
    number: '10',
    title: '초록우산 행사',
    subtitle: 'EVENT DESIGN / CSR',
    description: '초록우산 어린이재단 후원 행사 및 홍보 부스 디자인 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://picsum.photos/seed/umbrella/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-5',
    number: '11',
    title: '한솔백제문화축제',
    subtitle: 'EVENT DESIGN / Festival',
    description: '백제의 역사를 테마로 한 한솔백제문화축제 통합 디자인 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://picsum.photos/seed/culture/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-4',
    number: '12',
    title: '새롬동행정복지센터 행사',
    subtitle: 'EVENT DESIGN / Public Service',
    description: '새롬동 주민센터 주관 각종 지역 행사 디자인 및 공간 구성 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://picsum.photos/seed/saerom/1200/800',
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-3',
    number: '13',
    title: '조치원읍 복합커뮤니티센터 준공식',
    subtitle: 'EVENT DESIGN / Ceremony',
    description: '조치원읍 복합커뮤니티센터 준공을 기념하는 행사장 디자인 및 공간 브랜딩 프로젝트입니다.',
    category: '행사디자인',
    thumbnail: 'https://picsum.photos/seed/ceremony/1200/800',
    images: [
      { url: 'https://picsum.photos/seed/event1/1200/800', caption: '행사장 입구 메인 무대' },
      { url: 'https://picsum.photos/seed/event2/1200/800', caption: '기념 행사 사이니지' }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-2',
    number: '02',
    title: '국립세종수목원',
    subtitle: 'PUBLIC DESIGN / Signage System',
    description: '국립세종수목원의 자연과 조화되는 사인 시스템 디자인 프로젝트입니다.',
    category: '공공디자인',
    thumbnail: '/images/pa1.jpg',
    images: [
      { url: '/images/pa2.jpg', caption: '수목원 입구 종합 안내도' },
      { url: '/images/pa3.jpg', caption: '산책로 방향 지시등' },
      { url: '/images/pa4.jpg', caption: '식물 정보 안내판 디자인' },
      { url: '/images/pa5.jpg', caption: '야간 조명 결합형 사이니지' },
    ],
    createdAt: new Date().toISOString()
  }
];

// --- Components ---

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
            src={src}
            alt="Project preview"
            className="h-[90%] aspect-video object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        ))}
      </motion.div>
    </div>
  );
};

const ProjectItem: React.FC<{ project: Project; onClick: (project: Project) => void; isAdmin?: boolean; onDelete?: (id: string) => void }> = ({ project, onClick, isAdmin, onDelete }) => {
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
        src={project.thumbnail} 
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />

      {/* Admin Quick Actions */}
      {isAdmin && onDelete && (
        <div className="absolute top-2 right-2 z-20 flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-brand-green/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center text-white">
        <h3 className="text-xl md:text-2xl font-display font-bold tracking-tight mb-2 leading-tight">
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
              <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-brand-green">
                {project.title}
              </h2>
              <p className="mt-4 text-sm md:text-base text-brand-green/60 max-w-xl leading-relaxed font-bold">
                {project.subtitle}
              </p>
              {project.description && (
                <p className="mt-2 text-xs md:text-sm text-brand-green/50 max-w-xl leading-relaxed italic">
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
              src={project.thumbnail} 
              alt={project.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Gallery */}
          {project.images && project.images.length > 0 && (
            <div className="grid grid-cols-1 gap-12">
              {project.images.map((imgObj, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="w-full rounded-sm overflow-hidden bg-gray-50">
                    <img 
                      src={typeof imgObj === 'string' ? imgObj : imgObj.url} 
                      alt={`${project.title} gallery ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {typeof imgObj !== 'string' && imgObj.caption && (
                    <p className="text-center text-xs md:text-sm text-brand-green/60 font-medium tracking-tight">
                      {imgObj.caption}
                    </p>
                  )}
                </div>
              ))}
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

const AddProjectModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (project: any) => Promise<void> }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: CATEGORIES[0],
    thumbnail: '',
    images: [] as { url: string; caption?: string }[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAdd({
        ...formData,
        number: '00', // Auto-generated or placeholder
        createdAt: new Date().toISOString()
      });
      onClose();
      setFormData({ title: '', subtitle: '', description: '', category: CATEGORIES[0], thumbnail: '', images: [] });
    } catch (error) {
      console.error("Failed to add project:", error);
      alert("프로젝트 추가 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, { url: '' }] }));
  };

  const updateImageField = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index].url = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9 }} animate={{ scale: 1 }}
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm p-8"
      >
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-2xl font-display font-bold">새 프로젝트 추가</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">카테고리</label>
              <select 
                className="w-full p-3 border border-gray-100 rounded-sm focus:border-brand-green outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">제목</label>
              <input required className="w-full p-3 border border-gray-100 rounded-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">부제목 (예: PUBLIC DESIGN / Signage)</label>
            <input required className="w-full p-3 border border-gray-100 rounded-sm" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">설명</label>
            <textarea className="w-full p-3 border border-gray-100 rounded-sm h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">썸네일 이미지 URL</label>
            <input required className="w-full p-3 border border-gray-100 rounded-sm" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">추가 상세 이미지 (Gallery)</label>
              <button type="button" onClick={addImageField} className="text-[10px] font-bold bg-gray-100 px-3 py-1 rounded-sm hover:bg-gray-200 uppercase tracking-widest">이미지 추가</button>
            </div>
            {formData.images.map((img, idx) => (
              <div key={idx} className="flex gap-2">
                <input className="flex-1 p-3 border border-gray-100 rounded-sm text-sm" value={img.url} placeholder="이미지 URL" onChange={e => updateImageField(idx, e.target.value)} />
                <button type="button" onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))} className="p-3 text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-6 mt-8 border-t">
            <button type="button" onClick={onClose} className="flex-1 py-4 border border-gray-200 font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50">취소</button>
            <button disabled={isSubmitting} type="submit" className="flex-1 py-4 bg-brand-green text-white font-bold uppercase tracking-widest text-[10px] hover:opacity-90 disabled:opacity-50">
              {isSubmitting ? '저장 중...' : '프로젝트 저장'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [footerClicks, setFooterClicks] = useState(0);
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Hidden admin access: 7 clicks on DABIN GROUP in footer
  const handleFooterClick = () => {
    const newCount = footerClicks + 1;
    setFooterClicks(newCount);
    if (newCount >= 7) {
      setShowLogin(true);
      setFooterClicks(0);
    }
    // Reset clicks after 3 seconds
    setTimeout(() => setFooterClicks(0), 3000);
  };

  useEffect(() => {
    if (!isConfigValid || !auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is in admins collection
        try {
          const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          setIsAdmin(adminDoc.exists());
        } catch (e) {
          console.error("Checking admin status failed:", e);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

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

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setShowLogin(false);
    } catch (e) {
      console.error("Login failed: ", e);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    setIsAdmin(false);
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      fetchProjects();
    } catch (e) {
      console.error("Delete failed: ", e);
    }
  };

  const handleAddProject = async (newProject: any) => {
    try {
      await addDoc(collection(db, 'projects'), newProject);
      fetchProjects();
    } catch (e) {
      console.error("Add failed: ", e);
      throw e;
    }
  };

  const projects = dbProjects.length > 0 ? dbProjects : SAMPLE_PROJECTS;

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-brand-green selection:bg-brand-green selection:text-white">
      {!isConfigValid && (
        <div className="hidden">
          Firebase API Key is missing.
        </div>
      )}
      {/* Admin Floating Actions */}
      {isAdmin && (
        <div className="fixed bottom-8 right-8 z-[150] flex flex-col gap-4">
          <button 
            onClick={() => setShowAddModal(true)}
            className="p-5 bg-brand-green text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center group"
            title="Add Project"
          >
            <Plus size={24} />
          </button>
          <button 
            onClick={handleLogout}
            className="p-5 bg-white text-brand-green rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center group border border-gray-100"
            title="Logout"
          >
            <LogOut size={24} />
          </button>
        </div>
      )}

      {/* Admin Modals */}
      <AnimatePresence>
        <AddProjectModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
          onAdd={handleAddProject} 
        />
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && !user && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowLogin(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-10 rounded-sm shadow-2xl max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Lock className="mx-auto mb-6 text-brand-green" size={48} />
              <h2 className="text-2xl font-display mb-2">관리자 로그인</h2>
              <p className="text-sm text-gray-500 mb-8">액세스 권한이 있는 계정으로 로그인해 주세요.</p>
              <button 
                onClick={handleLogin}
                className="w-full py-4 bg-brand-green text-white font-bold tracking-widest uppercase text-xs rounded-sm hover:opacity-90 transition-opacity"
              >
                Google로 로그인
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-end items-center p-6 md:p-10 pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
          {isAdmin && <span className="text-[10px] font-bold tracking-widest uppercase opacity-50 mix-blend-difference text-white">Admin Active</span>}
        </div>
      </header>

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
                  BACK TO PORTFOLIO
                </motion.button>
              )}
            </div>
            <h1 className="text-[21px] md:text-[4.2vw] font-display leading-[0.85] tracking-tighter uppercase mb-2 relative inline-block">
              {selectedCategory || 'PORTFOLIO'}
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
        {!selectedCategory ? (
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
                        <h2 className="text-[17px] md:text-[34px] lg:text-[42px] font-display font-black leading-none tracking-tighter transition-all duration-500">
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
                      isAdmin={isAdmin}
                      onDelete={handleDeleteProject}
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
                  handleFooterClick();
                  setSelectedCategory(null); 
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="font-display text-[27px] md:text-[32px] tracking-tighter hover:opacity-80 transition-opacity text-left outline-none"
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
                      대전광역시 서구 둔산로 45, 엠빌딩 3층
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
