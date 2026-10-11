import { FlagQuestion, WordQuestion, EmojiVoiceQuestion, DilemmaQuestion } from '../types/game';

// ==========================================
// 1. DATA TEBAK BENDERA DUNIA (120+ NEGARA)
// ==========================================
export const FLAG_DATABASE: Array<Omit<FlagQuestion, 'options'>> = [
  // ASIA TENGGARA (ASEAN)
  { id: 'f-id', countryCode: 'ID', countryName: 'Indonesia', flagEmoji: '🇮🇩', fact: 'Negara kepulauan terbesar di dunia dengan lebih dari 17.000 pulau.' },
  { id: 'f-my', countryCode: 'MY', countryName: 'Malaysia', flagEmoji: '🇲🇾', fact: 'Ibu kota Kuala Lumpur memiliki Menara Kembar Petronas yang terkenal.' },
  { id: 'f-sg', countryCode: 'SG', countryName: 'Singapura', flagEmoji: '🇸🇬', fact: 'Negara pulau modern dengan ikon patung Merlion dan bandara Changi.' },
  { id: 'f-th', countryCode: 'TH', countryName: 'Thailand', flagEmoji: '🇹🇭', fact: 'Dikenal sebagai Negeri Gajah Putih dan satu-satunya negara ASEAN tak pernah dijajah bangsa Eropa.' },
  { id: 'f-vn', countryCode: 'VN', countryName: 'Vietnam', flagEmoji: '🇻🇳', fact: 'Terkenal dengan Teluk Ha Long dan kuliner mie kuah Pho yang mendunia.' },
  { id: 'f-ph', countryCode: 'PH', countryName: 'Filipina', flagEmoji: '🇵🇭', fact: 'Negara kepulauan dengan lebih dari 7.000 pulau di Samudra Pasifik.' },
  { id: 'f-bn', countryCode: 'BN', countryName: 'Brunei Darussalam', flagEmoji: '🇧🇳', fact: 'Negara kesultanan kaya minyak yang terletak di pulau Kalimantan.' },
  { id: 'f-kh', countryCode: 'KH', countryName: 'Kamboja', flagEmoji: '🇰🇭', fact: 'Rumah bagi candi Hindu-Buddha terbesar di dunia, Angkor Wat.' },
  { id: 'f-la', countryCode: 'LA', countryName: 'Laos', flagEmoji: '🇱🇦', fact: 'Satu-satunya negara di Asia Tenggara yang tidak memiliki garis pantai (landlocked).' },
  { id: 'f-mm', countryCode: 'MM', countryName: 'Myanmar', flagEmoji: '🇲🇲', fact: 'Dikenal dengan ribuan pagoda emas kuno di dataran Bagan.' },
  { id: 'f-tl', countryCode: 'TL', countryName: 'Timor Leste', flagEmoji: '🇹🇱', fact: 'Negara tetangga Indonesia yang merdeka secara resmi pada tahun 2002.' },

  // ASIA TIMUR & SELATAN
  { id: 'f-jp', countryCode: 'JP', countryName: 'Jepang', flagEmoji: '🇯🇵', fact: 'Negeri Matahari Terbit dengan ikon Gunung Fuji dan kereta peluru Shinkansen.' },
  { id: 'f-kr', countryCode: 'KR', countryName: 'Korea Selatan', flagEmoji: '🇰🇷', fact: 'Pusat gelombang Hallyu, drama Korea, K-Pop, dan kuliner Kimchi.' },
  { id: 'f-kp', countryCode: 'KP', countryName: 'Korea Utara', flagEmoji: '🇰🇵', fact: 'Negara di semenanjung Korea bagian utara dengan ibu kota Pyongyang.' },
  { id: 'f-cn', countryCode: 'CN', countryName: 'Tiongkok (Cina)', flagEmoji: '🇨🇳', fact: 'Negara dengan Tembok Besar sepanjang ribuan kilometer dan habitat Panda raksasa.' },
  { id: 'f-tw', countryCode: 'TW', countryName: 'Taiwan', flagEmoji: '🇹🇼', fact: 'Pulau penghasil semikonduktor canggih dan tempat lahirnya minuman Boba Milk Tea.' },
  { id: 'f-mn', countryCode: 'MN', countryName: 'Mongolia', flagEmoji: '🇲🇳', fact: 'Negeri padang rumput luas tempat lahirnya penakluk legendaris Genghis Khan.' },
  { id: 'f-in', countryCode: 'IN', countryName: 'India', flagEmoji: '🇮🇳', fact: 'Negara dengan monumen cinta Taj Mahal dan industri perfilman Bollywood.' },
  { id: 'f-pk', countryCode: 'PK', countryName: 'Pakistan', flagEmoji: '🇵🇰', fact: 'Negara pemilik puncak tertinggi kedua di dunia, Gunung K2.' },
  { id: 'f-bd', countryCode: 'BD', countryName: 'Bangladesh', flagEmoji: '🇧🇩', fact: 'Negara dengan delta sungai terluas di dunia dan hutan bakau Sundarbans.' },
  { id: 'f-lk', countryCode: 'LK', countryName: 'Sri Lanka', flagEmoji: '🇱🇰', fact: 'Pulau berbentuk tetesan air mata di Samudra Hindia yang terkenal dengan teh Ceylon.' },
  { id: 'f-np', countryCode: 'NP', countryName: 'Nepal', flagEmoji: '🇳🇵', fact: 'Satu-satunya bendera negara di dunia yang tidak berbentuk segi empat; rumah Gunung Everest.' },
  { id: 'f-mv', countryCode: 'MV', countryName: 'Maladewa (Maldives)', flagEmoji: '🇲🇻', fact: 'Negara kepulauan atol dengan resor laut biru terindah di dunia.' },
  { id: 'f-bt', countryCode: 'BT', countryName: 'Bhutan', flagEmoji: '🇧🇹', fact: 'Negeri di pegunungan Himalaya yang mengukur kebahagiaan nasional (Gross National Happiness).' },

  // ASIA BARAT & TIMUR TENGAH
  { id: 'f-sa', countryCode: 'SA', countryName: 'Arab Saudi', flagEmoji: '🇸🇦', fact: 'Negara tempat berdirinya dua kota suci umat Islam, Makkah dan Madinah.' },
  { id: 'f-ae', countryCode: 'AE', countryName: 'Uni Emirat Arab', flagEmoji: '🇦🇪', fact: 'Rumah bagi gedung pencakar langit tertinggi di dunia, Burj Khalifa di Dubai.' },
  { id: 'f-qa', countryCode: 'QA', countryName: 'Qatar', flagEmoji: '🇶🇦', fact: 'Negara semenanjung kaya gas alam yang menjadi tuan rumah Piala Dunia FIFA 2022.' },
  { id: 'f-tr', countryCode: 'TR', countryName: 'Turki', flagEmoji: '🇹🇷', fact: 'Negara lintas benua dengan kota Istanbul yang membentang di Asia dan Eropa.' },
  { id: 'f-ir', countryCode: 'IR', countryName: 'Iran', flagEmoji: '🇮🇷', fact: 'Negeri peninggalan peradaban Persia kuno yang terkenal dengan karpet Persia.' },
  { id: 'f-iq', countryCode: 'IQ', countryName: 'Irak', flagEmoji: '🇮🇶', fact: 'Tempat lahirnya peradaban tertua Mesopotamia di antara Sungai Efrat dan Tigris.' },
  { id: 'f-ps', countryCode: 'PS', countryName: 'Palestina', flagEmoji: '🇵🇸', fact: 'Tanah bersejarah tempat berdirinya kompleks Masjid Al-Aqsa di Yerusalem.' },
  { id: 'f-jo', countryCode: 'JO', countryName: 'Yordania', flagEmoji: '🇯🇴', fact: 'Memiliki situs keajaiban dunia kota batu kuno Petra yang dipahat di tebing.' },
  { id: 'f-lb', countryCode: 'LB', countryName: 'Lebanon', flagEmoji: '🇱🇧', fact: 'Benderanya memiliki lambang pohon Cedar hijau yang khas.' },
  { id: 'f-kw', countryCode: 'KW', countryName: 'Kuwait', flagEmoji: '🇰🇼', fact: 'Negara dengan salah satu mata uang dengan nilai tukar terkuat di dunia (Dinar Kuwait).' },
  { id: 'f-om', countryCode: 'OM', countryName: 'Oman', flagEmoji: '🇴🇲', fact: 'Negara kesultanan di ujung tenggara jazirah Arab yang terkenal dengan benteng kuno.' },
  { id: 'f-ye', countryCode: 'YE', countryName: 'Yaman', flagEmoji: '🇾🇪', fact: 'Kota kuno Shibam di Yaman dijuluki sebagai "Manhattan dari Gurun Pasir".' },

  // ASIA TENGAH
  { id: 'f-kz', countryCode: 'KZ', countryName: 'Kazakhstan', flagEmoji: '🇰🇿', fact: 'Negara tanpa pantai (landlocked) terluas di dunia dan lokasi kosmodrom peluncuran roket Baikonur.' },
  { id: 'f-uz', countryCode: 'UZ', countryName: 'Uzbekistan', flagEmoji: '🇺🇿', fact: 'Jantung Jalur Sutra kuno dengan arsitektur kubah biru megah di Samarkand.' },

  // EROPA BARAT & UTARA
  { id: 'f-gb', countryCode: 'GB', countryName: 'Inggris (Britania Raya)', flagEmoji: '🇬🇧', fact: 'Rumah bagi jam Big Ben, keluarga kerajaan Inggris, dan liga sepak bola Premier League.' },
  { id: 'f-fr', countryCode: 'FR', countryName: 'Prancis', flagEmoji: '🇫🇷', fact: 'Memiliki Menara Eiffel di Paris dan museum seni terbesar di dunia Louvre.' },
  { id: 'f-de', countryCode: 'DE', countryName: 'Jerman', flagEmoji: '🇩🇪', fact: 'Terkenal dengan jalan tol Autobahn, kastil Neuschwanstein, dan festival Oktoberfest.' },
  { id: 'f-nl', countryCode: 'NL', countryName: 'Belanda', flagEmoji: '🇳🇱', fact: 'Negara kincir angin, bunga Tulip mekar, dan jalur sepeda terbanyak di dunia.' },
  { id: 'f-be', countryCode: 'BE', countryName: 'Belgia', flagEmoji: '🇧🇪', fact: 'Terkenal dengan cokelat praline lezat, wafel renyah, dan kantor pusat Uni Eropa.' },
  { id: 'f-ch', countryCode: 'CH', countryName: 'Swiss', flagEmoji: '🇨🇭', fact: 'Negara di lereng Pegunungan Alpen yang terkenal dengan keju fondue dan jam tangan presisi.' },
  { id: 'f-at', countryCode: 'AT', countryName: 'Austria', flagEmoji: '🇦🇹', fact: 'Kota kelahirannya komposer musik klasik Mozart di Salzburg.' },
  { id: 'f-ie', countryCode: 'IE', countryName: 'Irlandia', flagEmoji: '🇮🇪', fact: 'Dijuluki Pulau Zamrud karena perbukitan hijau segarnya yang membentang luas.' },
  { id: 'f-se', countryCode: 'SE', countryName: 'Swedia', flagEmoji: '🇸🇪', fact: 'Negara asal penghargaan Nobel dan perusahaan perabot IKEA.' },
  { id: 'f-no', countryCode: 'NO', countryName: 'Norwegia', flagEmoji: '🇳🇴', fact: 'Negeri ngarai laut Fjord spektakuler dan tempat menyaksikan cahaya Aurora Borealis.' },
  { id: 'f-dk', countryCode: 'DK', countryName: 'Denmark', flagEmoji: '🇩🇰', fact: 'Negara asal mainan balok susun LEGO dan dongeng Hans Christian Andersen.' },
  { id: 'f-fi', countryCode: 'FI', countryName: 'Finlandia', flagEmoji: '🇫🇮', fact: 'Sering dinobatkan sebagai negara paling bahagia di dunia dan negeri asal sauna.' },
  { id: 'f-is', countryCode: 'IS', countryName: 'Islandia', flagEmoji: '🇮🇸', fact: 'Tanah api dan es dengan banyak gunung berapi aktif dan mata air panas Geyser.' },

  // EROPA SELATAN & TIMUR
  { id: 'f-it', countryCode: 'IT', countryName: 'Italia', flagEmoji: '🇮🇹', fact: 'Negara asal Pizza, Menara Miring Pisa, Colosseum Roma, dan mobil sport Ferrari.' },
  { id: 'f-es', countryCode: 'ES', countryName: 'Spanyol', flagEmoji: '🇪🇸', fact: 'Terkenal dengan tarian Flamenco, istana Alhambra, dan tradisi La Tomatina.' },
  { id: 'f-pt', countryCode: 'PT', countryName: 'Portugal', flagEmoji: '🇵🇹', fact: 'Negara penjelajah samudra legendaris dan tanah asal pesepakbola Cristiano Ronaldo.' },
  { id: 'f-gr', countryCode: 'GR', countryName: 'Yunani', flagEmoji: '🇬🇷', fact: 'Tempat lahirnya pesta olahraga Olimpiade kuno dan filosofi barat di Athena.' },
  { id: 'f-pl', countryCode: 'PL', countryName: 'Polandia', flagEmoji: '🇵🇱', fact: 'Negara asal astronom penemu sistem tata surya heliosentris, Nicolaus Copernicus.' },
  { id: 'f-cz', countryCode: 'CZ', countryName: 'Ceko (Republik Ceko)', flagEmoji: '🇨🇿', fact: 'Ibu kota Praha dijuluki "Kota Seratus Menara" dengan kastil Praha megah.' },
  { id: 'f-hr', countryCode: 'HR', countryName: 'Kroasia', flagEmoji: '🇭🇷', fact: 'Terkenal dengan pantai Laut Adriatik yang jernih dan kota tua bersejarah Dubrovnik.' },
  { id: 'f-ru', countryCode: 'RU', countryName: 'Rusia', flagEmoji: '🇷🇺', fact: 'Negara dengan wilayah daratan terluas di dunia yang membentang di 11 zona waktu.' },
  { id: 'f-ua', countryCode: 'UA', countryName: 'Ukraina', flagEmoji: '🇺🇦', fact: 'Negara lumbung gandum Eropa dengan tanah hitam subur Chornozem.' },
  { id: 'f-ro', countryCode: 'RO', countryName: 'Rumania', flagEmoji: '🇷🇴', fact: 'Rumah bagi kastil Bran di wilayah Transilvania yang terkait legenda drakula.' },
  { id: 'f-hu', countryCode: 'HU', countryName: 'Hungaria', flagEmoji: '🇭🇺', fact: 'Ibu kotanya Budapest dibelah oleh Sungai Donau yang indah.' },
  { id: 'f-mc', countryCode: 'MC', countryName: 'Monako', flagEmoji: '🇲🇨', fact: 'Benderanya mirip Indonesia (merah putih), negara terkecil kedua di dunia.' },
  { id: 'f-va', countryCode: 'VA', countryName: 'Vatikan', flagEmoji: '🇻🇦', fact: 'Negara berdaulat terkecil di dunia yang berada di dalam kota Roma Italia.' },

  // BENUA AMERIKA (UTARA, TENGAH & SELATAN)
  { id: 'f-us', countryCode: 'US', countryName: 'Amerika Serikat', flagEmoji: '🇺🇸', fact: 'Terdiri dari 50 bintang di benderanya dan rumah bagi Patung Liberty di New York.' },
  { id: 'f-ca', countryCode: 'CA', countryName: 'Kanada', flagEmoji: '🇨🇦', fact: 'Memiliki lambang daun Maple merah di benderanya dan air terjun Niagara.' },
  { id: 'f-mx', countryCode: 'MX', countryName: 'Meksiko', flagEmoji: '🇲🇽', fact: 'Terkenal dengan kuliner Taco pedas, peradaban Maya, dan piramida Chichen Itza.' },
  { id: 'f-br', countryCode: 'BR', countryName: 'Brasil', flagEmoji: '🇧🇷', fact: 'Pemenang 5 trofi Piala Dunia, hutan Amazon terluas, dan patung Kristus Penebus Rio.' },
  { id: 'f-ar', countryCode: 'AR', countryName: 'Argentina', flagEmoji: '🇦🇷', fact: 'Negara tarian Tango, air terjun Iguazu spektakuler, dan pesepakbola Messi.' },
  { id: 'f-co', countryCode: 'CO', countryName: 'Kolombia', flagEmoji: '🇨🇴', fact: 'Salah satu penghasil biji kopi arabika terbaik dan bunga anggrek tercantik di dunia.' },
  { id: 'f-cl', countryCode: 'CL', countryName: 'Chili', flagEmoji: '🇨🇱', fact: 'Negara terpanjang dan tertipis di dunia dengan Gurun Atacama dan Pulau Paskah.' },
  { id: 'f-pe', countryCode: 'PE', countryName: 'Peru', flagEmoji: '🇵🇪', fact: 'Rumah bagi peninggalan benteng batu suku Inka di Machu Picchu di atas awan.' },
  { id: 'f-uy', countryCode: 'UY', countryName: 'Uruguay', flagEmoji: '🇺🇾', fact: 'Negara tuan rumah dan pemenang Piala Dunia FIFA pertama kali pada tahun 1930.' },
  { id: 'f-py', countryCode: 'PY', countryName: 'Paraguay', flagEmoji: '🇵🇾', fact: 'Satu-satunya bendera nasional yang memiliki lambang berbeda di bagian depan dan belakang.' },
  { id: 'f-bo', countryCode: 'BO', countryName: 'Bolivia', flagEmoji: '🇧🇴', fact: 'Memiliki dataran garam terbesar di dunia, Salar de Uyuni, yang memantulkan langit seperti cermin.' },
  { id: 'f-ec', countryCode: 'EC', countryName: 'Ekuador', flagEmoji: '🇪🇨', fact: 'Namanya berasal dari garis Khatulistiwa (Equator) dan pemilik Kepulauan Galapagos.' },
  { id: 'f-ve', countryCode: 'VE', countryName: 'Venezuela', flagEmoji: '🇻🇪', fact: 'Memiliki air terjun tertinggi di dunia yang jatuh tanpa putus, Angel Falls.' },
  { id: 'f-cu', countryCode: 'CU', countryName: 'Kuba', flagEmoji: '🇨🇺', fact: 'Pulau di Karibia yang terkenal dengan mobil-mobil antik klasik dan cerutu Havana.' },
  { id: 'f-jm', countryCode: 'JM', countryName: 'Jamaika', flagEmoji: '🇯🇲', fact: 'Negeri asal musik Reggae Bob Marley dan pelari tercepat dunia Usain Bolt.' },
  { id: 'f-cr', countryCode: 'CR', countryName: 'Kosta Rika', flagEmoji: '🇨🇷', fact: 'Negara pelopor ekowisata dunia tanpa tentara militer sejak tahun 1948.' },
  { id: 'f-pa', countryCode: 'PA', countryName: 'Panama', flagEmoji: '🇵🇦', fact: 'Terkenal dengan Terusan Panama yang menghubungkan Samudra Atlantik dan Samudra Pasifik.' },

  // BENUA AFRIKA
  { id: 'f-eg', countryCode: 'EG', countryName: 'Mesir', flagEmoji: '🇪🇬', fact: 'Memiliki monumen Piramida Giza berusia ribuan tahun dan Sungai Nil yang legendaris.' },
  { id: 'f-za', countryCode: 'ZA', countryName: 'Afrika Selatan', flagEmoji: '🇿🇦', fact: 'Negara pelangi dengan 3 ibu kota dan habitat satwa liar Big Five di taman nasional Kruger.' },
  { id: 'f-ma', countryCode: 'MA', countryName: 'Maroko', flagEmoji: '🇲🇦', fact: 'Negeri eksotis di Afrika Utara dengan kota biru Chefchaouen dan padang pasir Sahara.' },
  { id: 'f-ng', countryCode: 'NG', countryName: 'Nigeria', flagEmoji: '🇳🇬', fact: 'Negara dengan jumlah penduduk terpadat di benua Afrika dan industri film Nollywood.' },
  { id: 'f-ke', countryCode: 'KE', countryName: 'Kenya', flagEmoji: '🇰🇪', fact: 'Terkenal dengan migrasi akbar satwa liar di Masai Mara dan pelari maraton legendaris.' },
  { id: 'f-gh', countryCode: 'GH', countryName: 'Ghana', flagEmoji: '🇬🇭', fact: 'Salah satu penghasil kakao (bahan baku cokelat) terbesar di dunia.' },
  { id: 'f-sn', countryCode: 'SN', countryName: 'Senegal', flagEmoji: '🇸🇳', fact: 'Ibu kotanya Dakar terkenal sebagai garis akhir reli balap mobil gurun pasir paling ekstrem.' },
  { id: 'f-tz', countryCode: 'TZ', countryName: 'Tanzania', flagEmoji: '🇹🇿', fact: 'Rumah bagi puncak tertinggi di Afrika, Gunung Kilimanjaro bersalju abadi.' },
  { id: 'f-mg', countryCode: 'MG', countryName: 'Madagaskar', flagEmoji: '🇲🇬', fact: 'Pulau raksasa terisolasi dengan flora fauna unik seperti pohon Baobab dan Lemur.' },
  { id: 'f-et', countryCode: 'ET', countryName: 'Ethiopia', flagEmoji: '🇪🇹', fact: 'Tempat asal mula ditemukannya pohon kopi pertama kali di wilayah Kaffa.' },
  { id: 'f-ci', countryCode: 'CI', countryName: 'Pantai Gading (Côte d\'Ivoire)', flagEmoji: '🇨🇮', fact: 'Produsen biji kakao terbesar di dunia dengan bendera jingga, putih, dan hijau.' },
  { id: 'f-cm', countryCode: 'CM', countryName: 'Kamerun', flagEmoji: '🇨🇲', fact: 'Dijuluki sebagai "Miniatur Afrika" karena keragaman iklim dan budayanya.' },
  { id: 'f-dz', countryCode: 'DZ', countryName: 'Aljazair', flagEmoji: '🇩🇿', fact: 'Negara dengan wilayah daratan terluas di seluruh benua Afrika.' },
  { id: 'f-tn', countryCode: 'TN', countryName: 'Tunisia', flagEmoji: '🇹🇳', fact: 'Lokasi reruntuhan kota kuno Kartago dan latar syuting planet Tatooine di film Star Wars.' },

  // BENUA OSEANIA
  { id: 'f-au', countryCode: 'AU', countryName: 'Australia', flagEmoji: '🇦🇺', fact: 'Benua dan negara tempat tinggal hewan berkantung endemik Kangguru dan Koala.' },
  { id: 'f-nz', countryCode: 'NZ', countryName: 'Selandia Baru', flagEmoji: '🇳🇿', fact: 'Negeri suku Maori, burung Kiwi tak bersayap, dan lanskap film The Lord of the Rings.' },
  { id: 'f-fj', countryCode: 'FJ', countryName: 'Fiji', flagEmoji: '🇫🇯', fact: 'Negara kepulauan di Pasifik Selatan yang terkenal dengan keramahan warganya dan terumbu karang.' },
  { id: 'f-pg', countryCode: 'PG', countryName: 'Papua Nugini', flagEmoji: '🇵🇬', fact: 'Negara tetangga provinsi Papua Indonesia dengan lebih dari 800 bahasa daerah yang aktif.' },
  { id: 'f-ws', countryCode: 'WS', countryName: 'Samoa', flagEmoji: '🇼🇸', fact: 'Negara pulau Polinesia dengan budaya Fa\'a Samoa yang menjunjung tinggi kekeluargaan.' }
];

// ========================================================
// 2. DATA TEBAK KATA BAHASA INDONESIA (110+ TEKA-TEKI KATA)
// ========================================================
export const WORD_DATABASE: Array<Omit<WordQuestion, 'options'>> = [
  // KULINER NUSANTARA
  { id: 'w-1', word: 'RENDANG', clue: 'Olahan daging sapi Minangkabau dimasak dengan aneka rempah dan santan berjam-jam hingga kuah hitam kering.', category: 'Kuliner Nusantara', hint: 'Pernah dinobatkan sebagai salah satu makanan terenak di dunia' },
  { id: 'w-2', word: 'PEMPEK', clue: 'Kuliner Palembang dari adonan ikan dan sagu yang disantap bersama kuah cuko manis pedas asam.', category: 'Kuliner Nusantara', hint: 'Ada varian kapal selam yang berisi kuning telur' },
  { id: 'w-3', word: 'GUDEG', clue: 'Olahan nangka muda manis khas Yogyakarta yang dimasak bersama santan dan daun jati.', category: 'Kuliner Nusantara', hint: 'Sering disantap dengan krecek pedas dan telur bacem' },
  { id: 'w-4', word: 'RAWON', clue: 'Sup daging sapi khas Jawa Timur berkuah hitam pekat gurih berkat rempah istimewa kluwek.', category: 'Kuliner Nusantara', hint: 'Disajikan bersama tauge pendek, sambal terasi, dan telur asin' },
  { id: 'w-5', word: 'SATE', clue: 'Potongan daging ditusuk lidi bambu lalu dibakar di atas arang batok dan disiram bumbu kacang atau kecap.', category: 'Kuliner Nusantara', hint: 'Aroma bakaran arang bambunya sangat khas' },
  { id: 'w-6', word: 'TEMPE', clue: 'Makanan fermentasi kedelai menggunakan jamur Rhizopus yang menjadi sumber protein nabati favorit Indonesia.', category: 'Kuliner Nusantara', hint: 'Sering digoreng mendoan atau ditumis orek' },
  { id: 'w-7', word: 'PAPEDA', clue: 'Makanan pokok khas Papua dan Maluku berupa bubur sagu kenyal yang disantap dengan kuah kuning ikan.', category: 'Kuliner Nusantara', hint: 'Digulung menggunakan sepasang sumpit bambu khusus bernama gata-gata' },
  { id: 'w-8', word: 'BAKSO', clue: 'Bulatan daging sapi kenyal yang disajikan dengan kuah kaldu hangat, mie kuning, bihun, dan bawang goreng.', category: 'Kuliner Nusantara', hint: 'Sering dijual memakai gerobak keliling dengan mangkok ayam jago' },
  { id: 'w-9', word: 'KLEPON', clue: 'Kue bulat kenyal berwarna hijau daun suji bertabur kelapa parut yang meletus gula merah cair saat digigit.', category: 'Kue Tradisional', hint: 'Hati-hati gula merahnya muncrat di dalam mulut' },
  { id: 'w-10', word: 'CENDOL', clue: 'Minuman manis dingin berisi butiran tepung hijau beras pandan dengan santan gurih dan sirup gula aren.', category: 'Minuman Tradisional', hint: 'Sering disebut juga es dawet' },
  { id: 'w-11', word: 'KERAK TELOR', clue: 'Jajanan khas Betawi dari beras ketan, telur bebek, dan kelapa sangrai serundeng yang dimasak di wajan terbalik.', category: 'Kuliner Betawi', hint: 'Kuliner ikonik di Pekan Raya Jakarta (PRJ)' },
  { id: 'w-12', word: 'ONDE-ONDE', clue: 'Kue bulat goreng bertabur biji wijen di seluruh kulitnya dengan isian pasta kacang hijau manis legit.', category: 'Kue Tradisional', hint: 'Kulit luarnya kenyal renyah bertabur wijen' },
  { id: 'w-13', word: 'SAMBAL', clue: 'Ulekan cabai, bawang, dan terasi yang menjadi pelengkap wajib hampir di setiap piring makan orang Indonesia.', category: 'Pelengkap Makanan', hint: 'Tanpa benda ini makanan terasa kurang nendang' },
  { id: 'w-14', word: 'RUJAK', clue: 'Campuran potongan buah-buahan segar seperti mangga, kedondong, dan jambu yang dicocol bumbu gula merah pedas.', category: 'Camilan Buah', hint: 'Cocok dinikmati saat siang hari terik' },
  { id: 'w-15', word: 'MARTABAK', clue: 'Adonan tebal bersarang dengan topping cokelat keju wijen manis, atau kulit garing isi telur dan daging gurih.', category: 'Kuliner Malam', hint: 'Ada versi manis dan versi telur' },

  // FAUNA & SATWA
  { id: 'w-16', word: 'KOMODO', clue: 'Kadal purba terbesar di dunia yang merupakan satwa endemik langka di Nusa Tenggara Timur.', category: 'Fauna Indonesia', hint: 'Memiliki lidah bercabang kuning dan liur beracun' },
  { id: 'w-17', word: 'ORANGUTAN', clue: 'Kera besar berambut kemerahan dengan kecerdasan tinggi yang hidup bergelantungan di hutan Kalimantan dan Sumatra.', category: 'Fauna Hutan', hint: 'Menghabiskan sebagian besar hidupnya di atas tajuk pohon' },
  { id: 'w-18', word: 'CENDERAWASIH', clue: 'Burung elok berbulu warna-warni memikat asal Papua yang sering dijuluki burung dari surga (Bird of Paradise).', category: 'Unggas Cantik', hint: 'Tergambar pada uang koin pecahan rupiah klasik' },
  { id: 'w-19', word: 'LUMBA-LUMBA', clue: 'Mamalia laut cerdas yang suka berenang melompat di haluan kapal dan bernapas lewat lubang di atas kepalanya.', category: 'Biologi Laut', hint: 'Sering terlihat menyambut matahari terbit di pantai Lovina Bali' },
  { id: 'w-20', word: 'GURITA', clue: 'Hewan laut berbadan lunak tanpa tulang belakang, memiliki delapan lengan berpenghisap dan tinta hitam pertahanan.', category: 'Biologi Laut', hint: 'Bisa menyamar meniru warna dan tekstur karang' },
  { id: 'w-21', word: 'TRENGGILING', clue: 'Mamalia pemakan semut yang tubuhnya dilapisi sisik tebal keras dan akan menggulung seperti bola saat terancam.', category: 'Fauna Unik', hint: 'Menjilati sarang semut menggunakan lidahnya yang sangat panjang' },
  { id: 'w-22', word: 'KUKANG', clue: 'Primata malam bermata bulat besar yang gerakannya sangat lambat dan suka memeluk dahan pohon.', category: 'Fauna Nokturnal', hint: 'Sering dijuluki si pemalu' },
  { id: 'w-23', word: 'ANOA', clue: 'Hewan endemik Sulawesi bertubuh mirip kerbau kerdil yang hidup liar di hutan belantara.', category: 'Fauna Endemik', hint: 'Sering disebut kerbau kerdil' },
  { id: 'w-24', word: 'HARIMAU', clue: 'Kucing besar berbelang loreng oranye hitam yang merupakan predator puncak di rimba Sumatra.', category: 'Satwa Liar', hint: 'Raja predator bertaring tajam' },
  { id: 'w-25', word: 'KANGGURU', clue: 'Hewan berkantung yang melompat menggunakan kedua kaki belakangnya dan membawa anaknya di kantung perut.', category: 'Fauna Mamalia', hint: 'Ada jenis yang hidup di tanah dan ada kangguru pohon di Papua' },

  // BENDA & PERALATAN SEHARI-HARI
  { id: 'w-26', word: 'PAYUNG', clue: 'Saat cuaca cerah sering disimpan di sudut rumah, tapi saat langit menangis atau matahari menyengat selalu dibuka.', category: 'Benda Sehari-hari', hint: 'Punya kain tudung melingkar dan gagang bengkok' },
  { id: 'w-27', word: 'GUNTING', clue: 'Punya dua mata pisau yang saling bersilang, semakin sering mereka beradu maka lembaran di tengahnya terbelah.', category: 'Peralatan Rumah', hint: 'Dipakai memotong kain, kertas, dan rambut' },
  { id: 'w-28', word: 'JARUM', clue: 'Badanku ramping berujung runcing lancip, punya lubang kecil di satu ujungnya untuk dilalui seutas benang.', category: 'Peralatan Jahit', hint: 'Pasangan sejati dari benang jahit' },
  { id: 'w-29', word: 'SPION', clue: 'Kaca kecil yang menempel di stang atau pintu kendaraan untuk memantau keadaan di belakang tanpa menoleh.', category: 'Otomotif', hint: 'Wajib dilihat sebelum berbelok atau berpindah jalur' },
  { id: 'w-30', word: 'KELERENG', clue: 'Bulatan kaca bening mengilap warna-warni yang disentil anak-anak di tanah berdebu.', category: 'Permainan Klasik', hint: 'Sering disebut juga gundu' },
  { id: 'w-31', word: 'KULKAS', clue: 'Lemari yang tak pernah menyimpan pakaian, selalu dingin membekukan es batu dan menjaga kesegaran sayuran.', category: 'Elektronik Rumah', hint: 'Memiliki bagian freezer di dalamnya' },
  { id: 'w-32', word: 'SEPATU', clue: 'Selalu berpasangan kanan dan kiri, punya tali atau perekat, setia melindungi telapak kakimu dari aspal panas.', category: 'Alas Kaki', hint: 'Dilepas sebelum melangkah masuk ke karpet rumah' },
  { id: 'w-33', word: 'CANGKUL', clue: 'Bilah besi pipih bergagang kayu panjang, senjata andalan para petani untuk membalik tanah gembur di sawah.', category: 'Peralatan Tani', hint: 'Ada lagu anak: Cangkul, cangkul, cangkul yang dalam' },
  { id: 'w-34', word: 'BANTAL', clue: 'Benda empuk bersarung kain yang selalu dicari saat mata mengantuk, tempat kepala merebahkan lelah.', category: 'Kamar Tidur', hint: 'Teman setia guling di atas kasur' },
  { id: 'w-35', word: 'KIPAS ANGIN', clue: 'Memiliki baling-baling yang berputar cepat menghasilkan hembusan angin sejuk saat ruangan terasa gerah.', category: 'Elektronik Rumah', hint: 'Bisa berputar menggeleng ke kanan dan kiri' },
  { id: 'w-36', word: 'SETRIKA', clue: 'Alat beralas logam yang menjadi sangat panas saat dialiri listrik untuk melicinkan pakaian kusut sehabis dicuci.', category: 'Elektronik Rumah', hint: 'Membuat baju kusut menjadi rapi kembali' },
  { id: 'w-37', word: 'EMBER', clue: 'Wadah silinder terbuka bergagang kawat melengkung yang digunakan menampung air saat mengepel atau mandi.', category: 'Alat Rumah Tangga', hint: 'Sering ditaruh di bawah keran air kamar mandi' },
  { id: 'w-38', word: 'PENSIL', clue: 'Batang kayu berisi grafit hitam yang bisa diraut lancip, menghasilkan goresan tulisan yang bisa dihapus karet penghapus.', category: 'Alat Tulis', hint: 'Ujungnya harus diraut jika patah atau tumpul' },
  { id: 'w-39', word: 'CERMIN', clue: 'Kaca datar mengilap yang meniru wajah dan gerakanmu persis tanpa pernah mengeluarkan suara.', category: 'Benda Kamar', hint: 'Tempat bercermin saat menyisir atau berdandan' },
  { id: 'w-40', word: 'DOMPET', clue: 'Lipatan kulit atau kain kecil tempat menyimpan uang kertas, koin, dan kartu identitas di dalam saku celana.', category: 'Aksesoris Saku', hint: 'Benda yang paling dicari saat hendak membayar di kasir' },

  // SENI & BUDAYA NUSANTARA
  { id: 'w-41', word: 'ANGKLUNG', clue: 'Alat musik bambu tradisional asal Jawa Barat yang mengeluarkan nada harmonis merdu saat digoyangkan.', category: 'Musik Nusantara', hint: 'Terdaftar sebagai Warisan Budaya Takbenda UNESCO' },
  { id: 'w-42', word: 'BATIK', clue: 'Kain bergambar motif indah nusantara yang dibuat menggunakan canting berisi malam lilin panas.', category: 'Karya Nusantara', hint: 'Kerap dikenakan pada hari Jumat dan acara resmi' },
  { id: 'w-43', word: 'KERIS', clue: 'Senjata tikam tradisional dengan bilah berluk-luk kelok indah dan pamor logam berlapis sakral.', category: 'Pusaka Tradisional', hint: 'Senjata warisan para ksatria dan raja Jawa' },
  { id: 'w-44', word: 'WAYANG', clue: 'Seni pertunjukan boneka kulit bayangan atau golek kayu yang dimainkan oleh seorang dalang semalam suntuk.', category: 'Seni Pertunjukan', hint: 'Menceritakan kisah Mahabharata dan Ramayana' },
  { id: 'w-45', word: 'GAMELAN', clue: 'Ansambel musik tradisional Jawa dan Bali yang terdiri dari gong, saron, bonang, kendang, dan kenong.', category: 'Musik Tradisional', hint: 'Dimainkan secara bersama-sama dalam satu kelompok penabuh' },
  { id: 'w-46', word: 'SASANDO', clue: 'Alat musik dawai petik tradisional dari Pulau Rote Nusa Tenggara Timur yang memiliki wadah daun lontar melengkung.', category: 'Alat Musik Tradisional', hint: 'Pernah menjadi gambar pada uang kertas lima ribu rupiah' },
  { id: 'w-47', word: 'REOG', clue: 'Kesenian tari topeng singa raksasa bermahkota bulu merak setinggi dua meter asal Ponorogo yang digigit di gigi penari.', category: 'Seni Tradisional', hint: 'Topeng dadak merak super berat digigit tanpa bantuan tangan' },
  { id: 'w-48', word: 'BLANGKON', clue: 'Penutup kepala tradisional pria khas Jawa dengan lipatan kain batik dan tonjolan mondolan di belakang.', category: 'Pakaian Adat', hint: 'Pelengkap busana beskap atau surjan pria' },
  { id: 'w-49', word: 'SONGKET', clue: 'Kain tenun mewah tradisional khas Minangkabau dan Palembang yang ditenun menggunakan benang emas atau perak berkilau.', category: 'Kain Tradisional', hint: 'Kain kebanggaan untuk upacara pernikahan adat' },
  { id: 'w-50', word: 'KOLINTANG', clue: 'Alat musik bilah-bilah kayu bernada yang dipukul menggunakan stik empuk asal Minahasa Sulawesi Utara.', category: 'Alat Musik Pukul', hint: 'Bilah kayunya disusun rapi di atas kotak resonansi' },

  // PROFESI & PEKERJAAN
  { id: 'w-51', word: 'PRAMUGARI', clue: 'Petugas ramah di pesawat terbang yang bertugas melayani kenyamanan dan memastikan keselamatan seluruh penumpang di udara.', category: 'Profesi Udara', hint: 'Bekerja di dalam kabin pesawat di atas awan' },
  { id: 'w-52', word: 'MASINIS', clue: 'Orang yang bertugas mengemudikan lokomotif kereta api di atas jalur rel dari stasiun ke stasiun.', category: 'Profesi Transportasi', hint: 'Meniup semboyan suling kereta api' },
  { id: 'w-53', word: 'ASTRONOT', clue: 'Penjelajah pemberani yang memakai baju luar angkasa khusus dan terbang keluar dari atmosfer bumi dengan roket.', category: 'Profesi Sains', hint: 'Melayang di stasiun luar angkasa tanpa gravitasi' },
  { id: 'w-54', word: 'NAHKODA', clue: 'Pemimpin tertinggi di atas kapal laut yang bertanggung jawab penuh atas kemudi pelayaran mengarungi samudra luas.', category: 'Profesi Maritim', hint: 'Kapten yang mengarahkan kompas haluan kapal di laut' },
  { id: 'w-55', word: 'ARSITEK', clue: 'Ahli yang merancang denah, bentuk estetika, dan tata ruang sebuah gedung megah sebelum dibangun para tukang.', category: 'Profesi Kreatif', hint: 'Menggambar rancangan cetak biru gedung di atas meja gambar' },
  { id: 'w-56', word: 'PETANI', clue: 'Pahlawan pangan yang mencangkul sawah, menanam bibit padi, dan merawat tanaman hingga masa panen tiba.', category: 'Pekerjaan Mulia', hint: 'Bekerja bermandikan terik matahari mengenakan topi caping' },
  { id: 'w-57', word: 'NELAYAN', clue: 'Pemberani yang menerjang deburan ombak malam hari dengan perahu dan jaring demi menangkap ikan segar di laut.', category: 'Pekerjaan Maritim', hint: 'Berangkat melaut malam hari dan pulang saat fajar membawa hasil tangkapan' },
  { id: 'w-58', word: 'PEMADAM', clue: 'Pasukan berseragam tahan api yang menaiki mobil bersirine meraung-raung dan menyemprotkan air memadamkan amukan si jago merah.', category: 'Layanan Darurat', hint: 'Membawa selang air besar dan tangga penyelamat' },
  { id: 'w-59', word: 'DOKTER', clue: 'Tenaga medis berjas putih yang memeriksa detak jantung pasien menggunakan stetoskop dan meresepkan obat kesembuhan.', category: 'Kesehatan', hint: 'Mengalungkan stetoskop di lehernya' },
  { id: 'w-60', word: 'KOKI', clue: 'Ahli meracik bumbu dan mengolah masakan lezat di dapur restoran bintang lima dengan mengenakan topi putih tinggi.', category: 'Kuliner Profesional', hint: 'Sering disebut juga dengan istilah Chef' },

  // FENOMENA ALAM & GEOGRAFI
  { id: 'w-61', word: 'PELANGI', clue: 'Busur spektrum tujuh warna mempesona di cakrawala saat tetesan air hujan dibiaskan oleh pancaran sinar matahari.', category: 'Fenomena Langit', hint: 'Urutan warnanya disingkat Me-Ji-Ku-Hi-Bi-Ni-U' },
  { id: 'w-62', word: 'PETIR', clue: 'Kilatan cahaya listrik raksasa di langit yang menyambar sesaat dan disusul suara dentuman guntur menggelegar.', category: 'Cuaca Ekstrem', hint: 'Kilatannya tampak lebih dulu sebelum suaranya terdengar' },
  { id: 'w-63', word: 'TSUNAMI', clue: 'Gelombang pasang laut raksasa berkecepatan tinggi yang tercipta akibat pergeseran lempeng gempa di dasar samudra.', category: 'Bencana Alam', hint: 'Air laut sempat surut drastis sebelum menerjang daratan' },
  { id: 'w-64', word: 'GERHANA', clue: 'Fenomena ketika matahari, bulan, dan bumi berada pada satu garis lurus hingga cahaya tertutup bayangan.', category: 'Astronomi', hint: 'Bisa berupa gerhana matahari atau gerhana bulan' },
  { id: 'w-65', word: 'AIR TERJUN', clue: 'Aliran sungai yang terjun bebas dari tebing batu tinggi curam menghasilkan deburan buih air sejuk.', category: 'Wisata Alam', hint: 'Sering disebut juga curug atau coban di daerah Jawa' },
  { id: 'w-66', word: 'SALJU', clue: 'Kristal es putih lembut yang jatuh perlahan dari awan dingin saat musim dingin di negara empat musim.', category: 'Iklim Dingin', hint: 'Bahan membuat boneka salju dan bermain ski' },
  { id: 'w-67', word: 'DANAU TOBA', clue: 'Danau vulkanik terbesar di dunia yang terbentuk akibat letusan gunung super purba, dengan pulau Samosir di tengahnya.', category: 'Geografi Nusantara', hint: 'Ikon wisata kebanggaan di Sumatra Utara' },
  { id: 'w-68', word: 'KABUT', clue: 'Awan uap air tebal yang melayang rendah di permukaan tanah atau perbukitan sejuk hingga membatasi jarak pandang.', category: 'Alam Sejuk', hint: 'Sering menyelimuti udara pagi hari di kawasan pegunungan' },

  // TEKA-TEKI LOGIKA & KATA UNIK
  { id: 'w-69', word: 'BUKU', clue: 'Punya daun tapi bukan pohon, punya isi tapi bukan peti, dibaca lembar demi lembar tapi bukan koran.', category: 'Teka-Teki Benda', hint: 'Jendela dunia bagi mereka yang suka membaca' },
  { id: 'w-70', word: 'LILIN', clue: 'Saat masih muda tubuhku tinggi tegap, tapi semakin tua dan berguna bagi kegelapan tubuhku justru semakin memendek.', category: 'Teka-Teki Benda', hint: 'Meneteskan lelehan parafin saat dibakar sumbunya' },
  { id: 'w-71', word: 'JEJAK KAKI', clue: 'Semakin banyak kamu melangkah maju di atas pasir basah, semakin banyak benda ini kamu tinggalkan di belakangmu.', category: 'Teka-Teki Logika', hint: 'Membekas di pasir atau lumpur' },
  { id: 'w-72', word: 'BAYANGAN', clue: 'Selalu setia mengikutimu ke mana pun kamu pergi di bawah terik matahari, tapi langsung lenyap saat berada dalam gelap gulita.', category: 'Teka-Teki Fenomena', hint: 'Siluet hitam tubuhmu sendiri di tanah' },
  { id: 'w-73', word: 'WAKTU', clue: 'Selalu berjalan maju tanpa pernah menoleh ke belakang, tak bisa dibeli dengan miliaran rupiah, dan tak pernah menunggu siapa pun.', category: 'Filosofi Hidup', hint: 'Dihitung dengan detik, menit, jam, dan hari' },
  { id: 'w-74', word: 'KUNCI', clue: 'Punya gerigi lekuk khusus di badannya, mampu membuka pintu yang terkunci rapat meski badannya kecil mungil.', category: 'Benda Rumah', hint: 'Dimasukkan ke dalam lubang gembok lalu diputar' },
  { id: 'w-75', word: 'HANDUK', clue: 'Semakin sering benda ini kamu gunakan untuk mengeringkan badan basahmu, maka benda ini sendiri yang akan menjadi basah.', category: 'Teka-Teki Mandi', hint: 'Kain berserat empuk penyerap air sehabis mandi' },
  { id: 'w-76', word: 'GIGI', clue: 'Benda keras berwarna putih di dalam mulut yang bertugas mengunyah dan menghancurkan makanan sebelum ditelan.', category: 'Anatomi Tubuh', hint: 'Dibersihkan setiap hari dengan sikat dan pasta berbusa' },
  { id: 'w-77', word: 'TELUR', clue: 'Harus dipecahkan cangkang kerasnya terlebih dahulu sebelum isi putih dan kuningnya bisa dimasak dan dimakan.', category: 'Bahan Makanan', hint: 'Dihasilkan oleh ayam atau bebek' },
  { id: 'w-78', word: 'JARUM JAM', clue: 'Benda yang terus berputar mengelilingi angka satu sampai dua belas tanpa pernah merasa lelah atau berhenti sejenak.', category: 'Penunjuk Waktu', hint: 'Ada jarum pendek untuk jam dan jarum panjang untuk menit' },
  { id: 'w-79', word: 'PINTU', clue: 'Bisa dibuka dan ditutup, menjadi pembatas antara ruangan dalam rumah dengan dunia luar.', category: 'Bagian Rumah', hint: 'Diketuk terlebih dahulu sebelum masuk bertamu' },
  { id: 'w-80', word: 'KELERENG', clue: 'Batu kaca bulat licin warna-warni yang sering disentil di tanah lapang oleh anak-anak.', category: 'Mainan Tradisional', hint: 'Disebut juga gundu' }
];

// ==============================================================
// 3. DATA UJI KECOCOKAN / TELEPATI PILIHAN (100+ DILEMA LENGKAP)
// ==============================================================
export const DILEMMA_DATABASE: DilemmaQuestion[] = [
  // MAKANAN & KULINER
  { id: 'dl-1', title: 'Sekte Cara Makan Bubur Ayam', category: 'Kebiasaan Makan', optionA: { id: 'A', text: 'Diaduk rata biar bumbunya merata', emoji: '🥣' }, optionB: { id: 'B', text: 'Gak diaduk biar topping tetap rapi', emoji: '🥄' } },
  { id: 'dl-2', title: 'Sensasi Rasa Kuliner Favorit', category: 'Selera Lidah', optionA: { id: 'A', text: 'Pedas nampol bikin keringetan', emoji: '🌶️' }, optionB: { id: 'B', text: 'Manis gurih bikin mood naik', emoji: '🍰' } },
  { id: 'dl-3', title: 'Varian Olahan Mie Instan', category: 'Mie Instan', optionA: { id: 'A', text: 'Mie goreng gurih pakai telur ceplok', emoji: '🍳' }, optionB: { id: 'B', text: 'Mie kuah panas berkaldu hangat', emoji: '🍜' } },
  { id: 'dl-4', title: 'Minuman Peneman Nongkrong', category: 'Minuman', optionA: { id: 'A', text: 'Kopi hitam atau es kopi susu', emoji: '☕' }, optionB: { id: 'B', text: 'Teh melati wangi atau Boba manis', emoji: '🧋' } },
  { id: 'dl-5', title: 'Cara Menikmati Nasi Padang', category: 'Kuliner Nusantara', optionA: { id: 'A', text: 'Bungkus bawa pulang (porsi lebih banyak)', emoji: '📦' }, optionB: { id: 'B', text: 'Makan langsung di tempat (bisa nambah kuah)', emoji: '🍽️' } },
  { id: 'dl-6', title: 'Camilan Gorengan Wajib', category: 'Gorengan', optionA: { id: 'A', text: 'Bakwan / Bala-bala renyah', emoji: '🥬' }, optionB: { id: 'B', text: 'Tahu isi pedas / Mendoan hangat', emoji: '🧈' } },
  { id: 'dl-7', title: 'Tekstur Telur Ceplok Goreng', category: 'Masakan Rumah', optionA: { id: 'A', text: 'Setengah matang meleleh saat ditusuk', emoji: '🍳' }, optionB: { id: 'B', text: 'Matang garing pinggirannya crispy', emoji: '✨' } },
  { id: 'dl-8', title: 'Pilihan Fast Food Favorit', category: 'Fast Food', optionA: { id: 'A', text: 'Ayam goreng crispy berbumbu', emoji: '🍗' }, optionB: { id: 'B', text: 'Burger daging keju tebal', emoji: '🍔' } },
  { id: 'dl-9', title: 'Topping Pizza Paling Pas', category: 'Pizza', optionA: { id: 'A', text: 'Full keju mozzarella & daging gurih', emoji: '🧀' }, optionB: { id: 'B', text: 'Ada nanasnya (Hawaiian style segar)', emoji: '🍍' } },
  { id: 'dl-10', title: 'Gaya Minum Es Teh di Warung', category: 'Minuman Rakyat', optionA: { id: 'A', text: 'Es teh manis dingin segar', emoji: '🧊' }, optionB: { id: 'B', text: 'Teh tawar hangat penawar lemak', emoji: '🍵' } },

  // LIBURAN, HANGOUT & GAYA HIDUP
  { id: 'dl-11', title: 'Destinasi Liburan Impian', category: 'Liburan', optionA: { id: 'A', text: 'Pantai tropis santai & sunset', emoji: '🏖️' }, optionB: { id: 'B', text: 'Pegunungan sejuk & udara segar', emoji: '🏔️' } },
  { id: 'dl-12', title: 'Rencana Menghabiskan Malam Minggu', category: 'Weekend', optionA: { id: 'A', text: 'Pergi keluar jalan-jalan ke bioskop/mall', emoji: '🍿' }, optionB: { id: 'B', text: 'Rebahan di kasur nonton serial streaming', emoji: '🛋️' } },
  { id: 'dl-13', title: 'Gaya Merencanakan Perjalanan', category: 'Traveling', optionA: { id: 'A', text: 'Jadwal rapi tersusun menit demi menit', emoji: '📝' }, optionB: { id: 'B', text: 'Spontan kemana kaki melangkah (Go with flow)', emoji: '🎒' } },
  { id: 'dl-14', title: 'Ritme Waktu Beraktivitas', category: 'Jam Biologis', optionA: { id: 'A', text: 'Burung hantu / Ide lancar tengah malam', emoji: '🦉' }, optionB: { id: 'B', text: 'Early bird / Bangun subuh udara bersih', emoji: '🌅' } },
  { id: 'dl-15', title: 'Hewan Peliharaan Idaman', category: 'Hewan Peliharaan', optionA: { id: 'A', text: 'Kucing manja yang menggemaskan', emoji: '🐱' }, optionB: { id: 'B', text: 'Anjing setia yang pintar dan aktif', emoji: '🐶' } },
  { id: 'dl-16', title: 'Suasana Nongkrong Paling Nyaman', category: 'Social', optionA: { id: 'A', text: 'Kafe estetik tenang sambil dengerin lofi', emoji: '☕' }, optionB: { id: 'B', text: 'Angkringan kaki lima seru rame-rame', emoji: '🍢' } },
  { id: 'dl-17', title: 'Kondisi Kamar Tidur Saat Istirahat', category: 'Kenyamanan', optionA: { id: 'A', text: 'AC dingin menusuk pakai selimut tebal', emoji: '❄️' }, optionB: { id: 'B', text: 'Suhu ruangan sejuk alami semilir angin', emoji: '🍃' } },
  { id: 'dl-18', title: 'Pilihan Menginap Saat Liburan', category: 'Hotel vs Alam', optionA: { id: 'A', text: 'Hotel berbintang dengan kasur empuk mewah', emoji: '🏨' }, optionB: { id: 'B', text: 'Glamping / Tenda di tengah alam terbuka', emoji: '⛺' } },
  { id: 'dl-19', title: 'Kendaraan Jalan-Jalan Santai', category: 'Transportasi', optionA: { id: 'A', text: 'Naik motor boncengan kena angin sore', emoji: '🛵' }, optionB: { id: 'B', text: 'Naik mobil adem sambil dengerin playlist', emoji: '🚗' } },
  { id: 'dl-20', title: 'Saat Hujan Deras Turun di Rumah', category: 'Suasana Hati', optionA: { id: 'A', text: 'Tidur nyenyak berselimut dengar gemercik air', emoji: '😴' }, optionB: { id: 'B', text: 'Bikin mie rebus panas sambil ngopi melamun', emoji: '🍜' } },

  // KOMUNIKASI & HUBUNGAN
  { id: 'dl-21', title: 'Gaya Membalas Pesan Chat', category: 'Chatting', optionA: { id: 'A', text: 'Fast response langsung balas dalam hitungan detik', emoji: '⚡' }, optionB: { id: 'B', text: 'Santai, baru balas pas senggang atau selesai urusan', emoji: '🐢' } },
  { id: 'dl-22', title: 'Cara Berkomunikasi Jarak Jauh', category: 'LDR / Bestie', optionA: { id: 'A', text: 'Voice Call / Video Call berjam-jam sampai ketiduran', emoji: '📞' }, optionB: { id: 'B', text: 'Kirim-kiriman pesan chat dan meme lucu', emoji: '💬' } },
  { id: 'dl-23', title: 'Gaya Membayar Saat Kencan Pertama', category: 'Etika Kencan', optionA: { id: 'A', text: 'Salah satu mentraktir penuh secara bergantian', emoji: '💳' }, optionB: { id: 'B', text: 'Split bill bayar porsi masing-masing adil', emoji: '🧾' } },
  { id: 'dl-24', title: 'Sikap Saat Menyambut Hari Ulang Tahun', category: 'Ulang Tahun', optionA: { id: 'A', text: 'Suka kejutan surprise tak terduga', emoji: '🎉' }, optionB: { id: 'B', text: 'Mending ditanya langsung mau kado apa', emoji: '🎁' } },
  { id: 'dl-25', title: 'Tipe Sahabat / Pasangan Paling Nyaman', category: 'Karakter', optionA: { id: 'A', text: 'Humoris receh bikin ketawa terbahak-bahak', emoji: '😂' }, optionB: { id: 'B', text: 'Pendengar yang hangat, bijak, dan dewasa', emoji: '🥰' } },
  { id: 'dl-26', title: 'Menyelesaikan Masalah atau Perdebatan', category: 'Konflik', optionA: { id: 'A', text: 'Bahas dan selesaikan detik itu juga biar tuntas', emoji: '🗣️' }, optionB: { id: 'B', text: 'Tunggu kepala dingin dulu baru diobrolkan baik-baik', emoji: '🧊' } },
  { id: 'dl-27', title: 'Gaya Berfoto Bersama Pasangan / Bestie', category: 'Foto & Kenangan', optionA: { id: 'A', text: 'Foto candid estetik tanpa lihat kamera', emoji: '📸' }, optionB: { id: 'B', text: 'Pose gaya konyol muka jelek yang bikin ngakak', emoji: '🤪' } },
  { id: 'dl-28', title: 'Prioritas Menggunakan Uang Bonus / THR', category: 'Keuangan', optionA: { id: 'A', text: 'Langsung simpan ditabung atau diinvestasikan', emoji: '💰' }, optionB: { id: 'B', text: 'Self-reward belanja impian atau kuliner puas', emoji: '🛍️' } },

  // HIBURAN & KECERDASAN
  { id: 'dl-29', title: 'Genre Tontonan Film / Serial', category: 'Film', optionA: { id: 'A', text: 'Film horor / misteri thriller menegangkan', emoji: '👻' }, optionB: { id: 'B', text: 'Komedi romantis yang bikin senyum-senyum sendiri', emoji: '💖' } },
  { id: 'dl-30', title: 'Menikmati Musik Favorit', category: 'Musik', optionA: { id: 'A', text: 'Nonton festival konser live nyanyi bareng ribuan orang', emoji: '🎤' }, optionB: { id: 'B', text: 'Pasang headphone di kamar sendirian mendalami lirik', emoji: '🎧' } },
  { id: 'dl-31', title: 'Kekuatan Super Impian', category: 'Kekuatan Fantasi', optionA: { id: 'A', text: 'Bisa menghilang tak terlihat kapan pun', emoji: '🥷' }, optionB: { id: 'B', text: 'Bisa terbang bebas menembus awan di langit', emoji: '🦅' } },
  { id: 'dl-32', title: 'Mesin Penjelajah Waktu', category: 'Mesin Waktu', optionA: { id: 'A', text: 'Kembali ke masa lalu memperbaiki kenangan', emoji: '🕰️' }, optionB: { id: 'B', text: 'Melompat ke masa depan melihat takdir masa depan', emoji: '🚀' } }
];

// =========================================================================
// 4. DATA TEBAK EMOJI PANGGILAN SUARA TERLENGKAP OS TERBARU (100+ EMOJI)
// =========================================================================
export const EMOJI_VOICE_DATABASE: Array<{
  id: string;
  targetEmoji: string;
  name: string;
  category: string;
  forbiddenWords: string[];
  distractors: { emoji: string; name: string }[];
}> = [
  // OLAHRAGA & AKTIVITAS FISIK
  {
    id: 'ev-1',
    targetEmoji: '🧗‍♂️',
    name: 'Panjat Tebing',
    category: 'Olahraga Ekstrem',
    forbiddenWords: ['gunung', 'panjat', 'tebing', 'tali', 'batu'],
    distractors: [{ emoji: '🏄‍♂️', name: 'Selancar' }, { emoji: '🏂', name: 'Snowboard' }, { emoji: '🏊‍♂️', name: 'Berenang' }]
  },
  {
    id: 'ev-2',
    targetEmoji: '🏄‍♂️',
    name: 'Selancar Ombak',
    category: 'Olahraga Air',
    forbiddenWords: ['ombak', 'pantai', 'selancar', 'papan', 'laut'],
    distractors: [{ emoji: '🚣‍♂️', name: 'Dayung' }, { emoji: '🏊‍♂️', name: 'Berenang' }, { emoji: '⛵', name: 'Berlayar' }]
  },
  {
    id: 'ev-3',
    targetEmoji: '🤿',
    name: 'Menyelam (Diving / Snorkeling)',
    category: 'Eksplorasi Laut',
    forbiddenWords: ['selam', 'kacamata', 'karang', 'oksigen', 'bawah air'],
    distractors: [{ emoji: '🎣', name: 'Mancing' }, { emoji: '🏊‍♂️', name: 'Berenang' }, { emoji: '🏄‍♂️', name: 'Selancar' }]
  },
  {
    id: 'ev-4',
    targetEmoji: '🪂',
    name: 'Terjun Payung (Skydiving)',
    category: 'Olahraga Udara',
    forbiddenWords: ['terjun', 'payung', 'parasut', 'lompat', 'pesawat'],
    distractors: [{ emoji: '🪁', name: 'Layangan' }, { emoji: '🎈', name: 'Balon Udara' }, { emoji: '🚀', name: 'Roket' }]
  },
  {
    id: 'ev-5',
    targetEmoji: '🥊',
    name: 'Tinju (Boxing)',
    category: 'Bela Diri',
    forbiddenWords: ['tinju', 'sarung', 'pukul', 'ring', 'tyson'],
    distractors: [{ emoji: '🥋', name: 'Karate' }, { emoji: '🤺', name: 'Anggar' }, { emoji: '🏋️‍♂️', name: 'Angkat Beban' }]
  },
  {
    id: 'ev-6',
    targetEmoji: '🏹',
    name: 'Panahan (Archery)',
    category: 'Akurasi',
    forbiddenWords: ['panah', 'busur', 'target', 'bidik', 'robin hood'],
    distractors: [{ emoji: '🎯', name: 'Papan Dart' }, { emoji: '🔫', name: 'Tembak' }, { emoji: '⚔️', name: 'Pedang' }]
  },
  {
    id: 'ev-7',
    targetEmoji: '🎣',
    name: 'Memancing Ikan',
    category: 'Hobi Santai',
    forbiddenWords: ['pancing', 'ikan', 'umpan', 'sungai', 'kail'],
    distractors: [{ emoji: '🚣‍♂️', name: 'Dayung' }, { emoji: '⛺', name: 'Kemah' }, { emoji: '⛵', name: 'Perahu' }]
  },
  {
    id: 'ev-8',
    targetEmoji: '🛹',
    name: 'Main Skateboard',
    category: 'Olahraga Jalanan',
    forbiddenWords: ['skate', 'papan', 'roda', 'aspal', 'meluncur'],
    distractors: [{ emoji: '🛴', name: 'Skuter' }, { emoji: '🚲', name: 'Sepeda' }, { emoji: '⛸️', name: 'Sepatu Roda' }]
  },
  {
    id: 'ev-9',
    targetEmoji: '🎳',
    name: 'Main Bowling',
    category: 'Permainan Gelinding',
    forbiddenWords: ['bowling', 'pin', 'bola', 'strike', 'jalur'],
    distractors: [{ emoji: '⚽', name: 'Sepak Bola' }, { emoji: '🏀', name: 'Bola Basket' }, { emoji: '🎱', name: 'Biliar' }]
  },

  // MAKANAN & MINUMAN
  {
    id: 'ev-10',
    targetEmoji: '🍕',
    name: 'Pizza Keju',
    category: 'Kuliner',
    forbiddenWords: ['pizza', 'roti', 'keju', 'italia', 'potong'],
    distractors: [{ emoji: '🍔', name: 'Burger' }, { emoji: '🌭', name: 'Hotdog' }, { emoji: '🥪', name: 'Sandwich' }]
  },
  {
    id: 'ev-11',
    targetEmoji: '🍔',
    name: 'Burger Daging',
    category: 'Makanan Cepat Saji',
    forbiddenWords: ['burger', 'roti', 'daging', 'patty', 'selada'],
    distractors: [{ emoji: '🍕', name: 'Pizza' }, { emoji: '🌮', name: 'Taco' }, { emoji: '🍟', name: 'Kentang' }]
  },
  {
    id: 'ev-12',
    targetEmoji: '🍣',
    name: 'Sushi Gulung',
    category: 'Makanan Jepang',
    forbiddenWords: ['sushi', 'ikan', 'mentah', 'nasi', 'jepang'],
    distractors: [{ emoji: '🍙', name: 'Onigiri' }, { emoji: '🍜', name: 'Ramen' }, { emoji: '🥟', name: 'Dimsum' }]
  },
  {
    id: 'ev-13',
    targetEmoji: '🍜',
    name: 'Ramen / Mie Kuah',
    category: 'Kuliner Kuah',
    forbiddenWords: ['mie', 'kuah', 'ramen', 'sumpit', 'mangkuk'],
    distractors: [{ emoji: '🍲', name: 'Sup' }, { emoji: '🍝', name: 'Spageti' }, { emoji: '🍛', name: 'Kari' }]
  },
  {
    id: 'ev-14',
    targetEmoji: '🧋',
    name: 'Boba Milk Tea',
    category: 'Minuman Kekinian',
    forbiddenWords: ['boba', 'teh', 'susu', 'sedotan', 'tapioka'],
    distractors: [{ emoji: '☕', name: 'Kopi' }, { emoji: '🥤', name: 'Soda' }, { emoji: '🍧', name: 'Es Serut' }]
  },
  {
    id: 'ev-15',
    targetEmoji: '🍿',
    name: 'Popcorn Bioskop',
    category: 'Camilan Nonton',
    forbiddenWords: ['popcorn', 'jagung', 'bioskop', 'nonton', 'asin'],
    distractors: [{ emoji: '🍟', name: 'Kentang Goreng' }, { emoji: '🥨', name: 'Pretzel' }, { emoji: '🥜', name: 'Kacang' }]
  },
  {
    id: 'ev-16',
    targetEmoji: '🥑',
    name: 'Alpukat Hijau',
    category: 'Buah Sehat',
    forbiddenWords: ['alpukat', 'biji', 'hijau', 'jus', 'lemak'],
    distractors: [{ emoji: '🥥', name: 'Kelapa' }, { emoji: '🥝', name: 'Kiwi' }, { emoji: '🍈', name: 'Melon' }]
  },
  {
    id: 'ev-17',
    targetEmoji: '🍦',
    name: 'Es Krim Cone',
    category: 'Dessert Manis',
    forbiddenWords: ['es krim', 'dingin', 'cone', 'jilat', 'meleleh'],
    distractors: [{ emoji: '🍧', name: 'Es Serut' }, { emoji: '🍩', name: 'Donat' }, { emoji: '🍰', name: 'Kue' }]
  },

  // HEWAN & SATWA LIAR
  {
    id: 'ev-18',
    targetEmoji: '🦁',
    name: 'Singa (Raja Hutan)',
    category: 'Hewan Liar',
    forbiddenWords: ['singa', 'raja', 'hutan', 'rambut', 'aum'],
    distractors: [{ emoji: '🐯', name: 'Harimau' }, { emoji: '🐻', name: 'Beruang' }, { emoji: '🐆', name: 'Macan Tutul' }]
  },
  {
    id: 'ev-19',
    targetEmoji: '🦥',
    name: 'Kukang / Sloth',
    category: 'Hewan Unik',
    forbiddenWords: ['sloth', 'kukang', 'lambat', 'pohon', 'tidur'],
    distractors: [{ emoji: '🐨', name: 'Koala' }, { emoji: '🦔', name: 'Landak' }, { emoji: '🦦', name: 'Berang-berang' }]
  },
  {
    id: 'ev-20',
    targetEmoji: '🐼',
    name: 'Panda Raksasa',
    category: 'Hewan Imut',
    forbiddenWords: ['panda', 'bambu', 'hitam putih', 'tiongkok', 'beruang'],
    distractors: [{ emoji: '🐨', name: 'Koala' }, { emoji: '🐻', name: 'Beruang' }, { emoji: '🦝', name: 'Rakun' }]
  },
  {
    id: 'ev-21',
    targetEmoji: '🦉',
    name: 'Burung Hantu',
    category: 'Unggas Malam',
    forbiddenWords: ['hantu', 'burung', 'malam', 'mata bulat', 'leher putar'],
    distractors: [{ emoji: '🦅', name: 'Elang' }, { emoji: '🦇', name: 'Kelelawar' }, { emoji: '🦜', name: 'Beo' }]
  },
  {
    id: 'ev-22',
    targetEmoji: '🦈',
    name: 'Ikan Hiu',
    category: 'Predator Laut',
    forbiddenWords: ['hiu', 'taring', 'sirip', 'laut', 'megalodon'],
    distractors: [{ emoji: '🐬', name: 'Lumba-lumba' }, { emoji: '🐳', name: 'Paus' }, { emoji: '🐊', name: 'Buaya' }]
  },
  {
    id: 'ev-23',
    targetEmoji: '🐙',
    name: 'Gurita (Octopus)',
    category: 'Hewan Laut',
    forbiddenWords: ['gurita', 'delapan', 'tentakel', 'tinta', 'penghisap'],
    distractors: [{ emoji: '🦑', name: 'Cumi' }, { emoji: '🦀', name: 'Kepiting' }, { emoji: '🦞', name: 'Lobster' }]
  },
  {
    id: 'ev-24',
    targetEmoji: '🦘',
    name: 'Kangguru Australia',
    category: 'Hewan Berkantung',
    forbiddenWords: ['kangguru', 'lompat', 'kantung', 'anak', 'australia'],
    distractors: [{ emoji: '🦌', name: 'Rusa' }, { emoji: '🐇', name: 'Kelinci' }, { emoji: '🦙', name: 'Llama' }]
  },
  {
    id: 'ev-25',
    targetEmoji: '🦩',
    name: 'Burung Flamingo',
    category: 'Unggas Cantik',
    forbiddenWords: ['flamingo', 'merah muda', 'pink', 'satu kaki', 'rawa'],
    distractors: [{ emoji: '🦢', name: 'Angsa' }, { emoji: '🦚', name: 'Merak' }, { emoji: '🕊️', name: 'Merpati' }]
  },
  {
    id: 'ev-26',
    targetEmoji: '🦖',
    name: 'Dinosaurus T-Rex',
    category: 'Satwa Purba',
    forbiddenWords: ['dinosaurus', 't-rex', 'tangan kecil', 'purba', 'taring'],
    distractors: [{ emoji: '🐊', name: 'Buaya' }, { emoji: '🐉', name: 'Naga' }, { emoji: '🦎', name: 'Kadal' }]
  },

  // FANTASI, PROFESI & KARAKTER
  {
    id: 'ev-27',
    targetEmoji: '🧛‍♂️',
    name: 'Vampir Drakula',
    category: 'Karakter Horor',
    forbiddenWords: ['vampir', 'drakula', 'darah', 'taring', 'kelelawar'],
    distractors: [{ emoji: '🧟‍♂️', name: 'Zombi' }, { emoji: '🧙‍♂️', name: 'Penyihir' }, { emoji: '👻', name: 'Hantu' }]
  },
  {
    id: 'ev-28',
    targetEmoji: '🥷',
    name: 'Ninja Bertopeng',
    category: 'Prajurit Senyap',
    forbiddenWords: ['ninja', 'pedang', 'topeng', 'jepang', 'sembunyi'],
    distractors: [{ emoji: '🦸‍♂️', name: 'Pahlawan' }, { emoji: '🧙‍♂️', name: 'Penyihir' }, { emoji: '🤺', name: 'Pendekar' }]
  },
  {
    id: 'ev-29',
    targetEmoji: '👨‍🚀',
    name: 'Astronot Luar Angkasa',
    category: 'Penjelajah Antariksa',
    forbiddenWords: ['astronot', 'bulan', 'baju putih', 'luar angkasa', 'melayang'],
    distractors: [{ emoji: '👨‍✈️', name: 'Pilot' }, { emoji: '👨‍🔬', name: 'Ilmuwan' }, { emoji: '👨‍🚒', name: 'Pemadam' }]
  },
  {
    id: 'ev-30',
    targetEmoji: '🧙‍♂️',
    name: 'Penyihir Berjanggut (Wizard)',
    category: 'Karakter Fantasi',
    forbiddenWords: ['penyihir', 'tongkat', 'mantra', 'topi kerucut', 'sihir'],
    distractors: [{ emoji: '🧛‍♂️', name: 'Vampir' }, { emoji: '🧞‍♂️', name: 'Jin' }, { emoji: '🎅', name: 'Santa' }]
  },
  {
    id: 'ev-31',
    targetEmoji: '🕵️‍♂️',
    name: 'Detektif Rahasia',
    category: 'Penyelidik',
    forbiddenWords: ['detektif', 'kaca pembesar', 'jas', 'topi', 'kasus'],
    distractors: [{ emoji: '👮‍♂️', name: 'Polisi' }, { emoji: '🥷', name: 'Ninja' }, { emoji: '👨‍⚕️', name: 'Dokter' }]
  },

  // TEKNOLOGI, ALAM & BENDA
  {
    id: 'ev-32',
    targetEmoji: '🚀',
    name: 'Roket Meluncur',
    category: 'Teknologi Antariksa',
    forbiddenWords: ['roket', 'api', 'luar angkasa', 'bulan', 'luncur'],
    distractors: [{ emoji: '✈️', name: 'Pesawat' }, { emoji: '🛸', name: 'UFO' }, { emoji: '🛰️', name: 'Satelit' }]
  },
  {
    id: 'ev-33',
    targetEmoji: '🌋',
    name: 'Gunung Berapi Meletus',
    category: 'Bencana Alam',
    forbiddenWords: ['gunung', 'meletus', 'lahar', 'lava', 'api'],
    distractors: [{ emoji: '🌪️', name: 'Tornado' }, { emoji: '🌊', name: 'Ombak' }, { emoji: '⚡', name: 'Petir' }]
  },
  {
    id: 'ev-34',
    targetEmoji: '🛸',
    name: 'Piring Terbang (UFO Alien)',
    category: 'Misteri Langit',
    forbiddenWords: ['ufo', 'alien', 'piring terbang', 'angkasa', 'sinar'],
    distractors: [{ emoji: '🚀', name: 'Roket' }, { emoji: '🛰️', name: 'Satelit' }, { emoji: '✈️', name: 'Pesawat' }]
  },
  {
    id: 'ev-35',
    targetEmoji: '🎬',
    name: 'Papan Sutradara Film',
    category: 'Perfilman',
    forbiddenWords: ['film', 'sutradara', 'action', 'kamera', 'syuting'],
    distractors: [{ emoji: '🍿', name: 'Popcorn' }, { emoji: '🎟️', name: 'Tiket' }, { emoji: '📺', name: 'Televisi' }]
  },
  {
    id: 'ev-36',
    targetEmoji: '💎',
    name: 'Berlian Berkilau (Diamond)',
    category: 'Batu Permata',
    forbiddenWords: ['berlian', 'mahal', 'permata', 'kilau', 'cincin'],
    distractors: [{ emoji: '👑', name: 'Mahkota' }, { emoji: '💍', name: 'Cincin' }, { emoji: '🪙', name: 'Koin Emas' }]
  },
  {
    id: 'ev-37',
    targetEmoji: '💣',
    name: 'Bom Waktu Berdetak',
    category: 'Peledak',
    forbiddenWords: ['bom', 'ledak', 'sumbu', 'dinamit', 'hitam'],
    distractors: [{ emoji: '🧨', name: 'Petasan' }, { emoji: '🔥', name: 'Api' }, { emoji: '⚡', name: 'Petir' }]
  },
  {
    id: 'ev-38',
    targetEmoji: '🎸',
    name: 'Gitar Listrik Rock',
    category: 'Alat Musik',
    forbiddenWords: ['gitar', 'senar', 'petik', 'rock', 'musik'],
    distractors: [{ emoji: '🥁', name: 'Drum' }, { emoji: '🎹', name: 'Piano' }, { emoji: '🎷', name: 'Saksofon' }]
  },
  {
    id: 'ev-39',
    targetEmoji: '🤖',
    name: 'Robot Logam Cerdas',
    category: 'Kecerdasan Buatan',
    forbiddenWords: ['robot', 'besi', 'mesin', 'antena', 'android'],
    distractors: [{ emoji: '👾', name: 'Alien Pixel' }, { emoji: '🎮', name: 'Joystick' }, { emoji: '💻', name: 'Laptop' }]
  },
  {
    id: 'ev-40',
    targetEmoji: '🔮',
    name: 'Bola Kristal Ramalan',
    category: 'Misteri Sihir',
    forbiddenWords: ['kristal', 'ramal', 'bola', 'masa depan', 'dukun'],
    distractors: [{ emoji: '🪄', name: 'Tongkat Sihir' }, { emoji: '🕯️', name: 'Lilin' }, { emoji: '✨', name: 'Kilauan' }]
  }
];

// Helper functions for randomized rounds
export function generateFlagQuestion(): FlagQuestion {
  const randomIndex = Math.floor(Math.random() * FLAG_DATABASE.length);
  const target = FLAG_DATABASE[randomIndex];

  const wrongOptions: string[] = [];
  while (wrongOptions.length < 3) {
    const candidate = FLAG_DATABASE[Math.floor(Math.random() * FLAG_DATABASE.length)].countryName;
    if (candidate !== target.countryName && !wrongOptions.includes(candidate)) {
      wrongOptions.push(candidate);
    }
  }

  const options = [target.countryName, ...wrongOptions].sort(() => Math.random() - 0.5);

  return {
    ...target,
    options
  };
}

export function generateWordQuestion(): WordQuestion {
  const randomIndex = Math.floor(Math.random() * WORD_DATABASE.length);
  const target = WORD_DATABASE[randomIndex];

  const wrongOptions: string[] = [];
  while (wrongOptions.length < 3) {
    const candidate = WORD_DATABASE[Math.floor(Math.random() * WORD_DATABASE.length)].word;
    if (candidate !== target.word && !wrongOptions.includes(candidate)) {
      wrongOptions.push(candidate);
    }
  }

  const options = [target.word, ...wrongOptions].sort(() => Math.random() - 0.5);

  return {
    ...target,
    options
  };
}

export function generateEmojiVoiceQuestion(player1Id: string, player2Id: string, roundNumber: number): EmojiVoiceQuestion {
  const randomIndex = Math.floor(Math.random() * EMOJI_VOICE_DATABASE.length);
  const target = EMOJI_VOICE_DATABASE[randomIndex];

  const isPlayer1Describer = roundNumber % 2 !== 0;
  const describerPlayerId = isPlayer1Describer ? player1Id : player2Id;
  const guesserPlayerId = isPlayer1Describer ? player2Id : player1Id;

  const options = [
    { emoji: target.targetEmoji, name: target.name },
    ...target.distractors.slice(0, 3)
  ].sort(() => Math.random() - 0.5);

  return {
    id: `${target.id}-${Date.now()}`,
    targetEmoji: target.targetEmoji,
    name: target.name,
    category: target.category,
    forbiddenWords: target.forbiddenWords,
    options,
    describerPlayerId,
    guesserPlayerId
  };
}

export function generateDilemmaQuestion(usedIds: string[] = []): DilemmaQuestion {
  const available = DILEMMA_DATABASE.filter(d => !usedIds.includes(d.id));
  const pool = available.length > 0 ? available : DILEMMA_DATABASE;
  return pool[Math.floor(Math.random() * pool.length)];
}
