package com.ssj.geekfight.api

/** Known coach id → name mapping (statically scraped). */
val COACH_DIRECTORY: Map<Int, String> = mapOf(
    18 to "Beer", 20 to "Pub", 21 to "张龙", 22 to "关涛",
    23 to "Thiago", 24 to "Ni-yom", 25 to "Hua", 30 to "Menu",
    31 to "Fiw", 32 to "Flim", 33 to "Bos", 108 to "Murillo",
    110 to "yens", 111 to "max", 113 to "JoJo", 114 to "Au",
    115 to "Fam", 116 to "Jom", 118 to "Dafabio", 119 to "Tee",
    123 to "Ta", 126 to "Big", 130 to "Carlos", 131 to "Aman",
    135 to "Luiz", 136 to "Raya", 137 to "Jeng", 138 to "Tum",
    139 to "MOS II", 140 to "Austin", 143 to "Tong", 146 to "MOS",
    147 to "SK", 150 to "Zing", 151 to "张鹏洋", 153 to "POOM",
    155 to "Tancredo", 156 to "Palm", 157 to "Jay", 159 to "Dan·MT",
    161 to "Ton", 163 to "U", 173 to "White", 174 to "Lha",
    175 to "AA", 176 to "Aek", 179 to "Nano",
)

data class CoachEntry(val id: Int, val name: String)

val COACH_LIST: List<CoachEntry> = COACH_DIRECTORY.map { (id, name) -> CoachEntry(id, name) }
    .sortedBy { it.name }

fun coachNameById(id: Int): String = COACH_DIRECTORY[id] ?: "ID $id"
