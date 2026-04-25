"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const skills = [
    // Frontend
    { name: 'React', category: client_1.SkillCategory.FRONTEND },
    { name: 'HTML/CSS', category: client_1.SkillCategory.FRONTEND },
    { name: 'Tailwind CSS', category: client_1.SkillCategory.FRONTEND },
    // Backend
    { name: 'Node.js', category: client_1.SkillCategory.BACKEND },
    { name: 'Express', category: client_1.SkillCategory.BACKEND },
    { name: 'Django', category: client_1.SkillCategory.BACKEND },
    { name: 'SQL', category: client_1.SkillCategory.BACKEND },
    // Full Stack
    { name: 'Next.js', category: client_1.SkillCategory.FULLSTACK },
    { name: 'NestJS', category: client_1.SkillCategory.FULLSTACK },
    { name: 'GraphQL', category: client_1.SkillCategory.FULLSTACK },
    // Data Science
    { name: 'Python', category: client_1.SkillCategory.DATA_SCIENCE },
    { name: 'R', category: client_1.SkillCategory.DATA_SCIENCE },
    { name: 'TensorFlow', category: client_1.SkillCategory.DATA_SCIENCE },
    // Machine Learning
    { name: 'Scikit-learn', category: client_1.SkillCategory.MACHINE_LEARNING },
    { name: 'PyTorch', category: client_1.SkillCategory.MACHINE_LEARNING },
    // Mobile
    { name: 'React Native', category: client_1.SkillCategory.MOBILE },
    { name: 'Flutter', category: client_1.SkillCategory.MOBILE },
    // DevOps
    { name: 'Docker', category: client_1.SkillCategory.DEVOPS },
    { name: 'Kubernetes', category: client_1.SkillCategory.DEVOPS },
    { name: 'AWS', category: client_1.SkillCategory.DEVOPS },
    // UI/UX
    { name: 'Figma', category: client_1.SkillCategory.UI_UX_DESIGN },
    { name: 'Adobe XD', category: client_1.SkillCategory.UI_UX_DESIGN },
    { name: 'Sketch', category: client_1.SkillCategory.UI_UX_DESIGN },
    // Other
    { name: 'Git', category: client_1.SkillCategory.OTHER },
];
async function main() {
    for (const skill of skills) {
        await prisma.skill.upsert({
            where: { name: skill.name },
            update: {},
            create: skill,
        });
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
