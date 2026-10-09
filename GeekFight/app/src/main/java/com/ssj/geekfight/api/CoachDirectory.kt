package com.ssj.geekfight.api

/** Coach roster from reports/fightgeek-coaches-2026-09-29.json plus retained manual entries. */
val COACH_DIRECTORY: Map<Int, String> = mapOf(
    13 to "SAM", 14 to "卡风", 15 to "Victor", 18 to "Beer",
    19 to "Boom", 20 to "Pub", 21 to "张龙", 22 to "关涛",
    23 to "Thiago",
    24 to "Ni-yom", 25 to "Hua", 27 to "DIOSNEL", 28 to "Yonder",
    30 to "Menu", 31 to "Fiw", 32 to "Flim", 33 to "Bos",
    37 to "Moiran", 103 to "vidal", 104 to "Orlando", 106 to "RV",
    108 to "Murillo", 109 to "Elis", 110 to "yens", 111 to "max",
    112 to "Lawa",
    113 to "JoJo", 114 to "Au", 115 to "Fam", 116 to "Jom",
    118 to "Dafabio", 119 to "Tee", 120 to "Santos", 121 to "Carvey",
    123 to "Ta", 124 to "Yoanny", 125 to "Mos III", 126 to "Big",
    128 to "Ryan", 129 to "Roman", 130 to "Carlos", 131 to "Aman",
    134 to "Tata", 135 to "Luiz", 136 to "Raya", 137 to "Jeng",
    138 to "Tum", 139 to "MOS II", 140 to "Austin", 141 to "Wowie",
    142 to "Boxing·dan", 143 to "Tong", 144 to "Acader", 145 to "Fabio",
    146 to "MOS", 147 to "SK", 148 to "ES", 149 to "Coco",
    150 to "Zing", 151 to "张鹏洋", 152 to "沙木", 153 to "POOM",
    154 to "多力洪", 155 to "Tancredo", 156 to "Palm", 157 to "Jay",
    158 to "aey", 159 to "Dan·MT",
    160 to "巴合", 161 to "Ton", 162 to "Asiel", 163 to "U",
    164 to "老易", 167 to "Reidel", 169 to "Champ", 170 to "Tim",
    171 to "Amit", 172 to "Royder", 173 to "White", 174 to "Lha",
    175 to "AA", 176 to "Aek", 177 to "Elias", 179 to "Nano",
    181 to "郭sir", 182 to "富然",
    183 to "杨东", 184 to "杨智棋", 185 to "王佳庆", 186 to "王胤一",
    187 to "胡旭", 188 to "张弯弯", 189 to "George", 190 to "Chai",
    191 to "Dream", 193 to "X", 194 to "Farm", 195 to "AO",
)

data class CoachEntry(val id: Int, val name: String)

val COACH_LIST: List<CoachEntry> = COACH_DIRECTORY.map { (id, name) -> CoachEntry(id, name) }
    .sortedBy { it.name }

fun coachNameById(id: Int): String = COACH_DIRECTORY[id] ?: "ID $id"
