-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('LOOKING', 'NEED_MEMBERS', 'FULL');

-- CreateEnum
CREATE TYPE "Result" AS ENUM ('WINNER', 'FINALIST', 'PARTICIPANT');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DEVELOPER', 'DESIGNER', 'PRODUCT_MANAGER', 'RESEARCHER');

-- CreateEnum
CREATE TYPE "SkillCategory" AS ENUM ('FRONTEND', 'BACKEND', 'FULLSTACK', 'DATA_SCIENCE', 'MACHINE_LEARNING', 'DEVOPS', 'MOBILE', 'UI_UX_DESIGN', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "yearOfStudy" INTEGER NOT NULL,
    "role" "Role" NOT NULL,
    "bio" TEXT,
    "githubURL" TEXT,
    "linkedinURL" TEXT,
    "preferredContact" TEXT,
    "avatarURL" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "SkillCategory" NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSkill" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "UserSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hackathon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "registrationDeadline" TIMESTAMP(3) NOT NULL,
    "maxTeamSize" INTEGER NOT NULL,
    "externalUrl" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hackathon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HackathonParticipant" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hackathonId" INTEGER NOT NULL,
    "teamStatus" "TeamStatus" NOT NULL,
    "spotsAvailable" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HackathonParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PastHackathon" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "role" "Role" NOT NULL,
    "result" "Result" NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PastHackathon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HackathonParticipant_userId_hackathonId_key" ON "HackathonParticipant"("userId", "hackathonId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hackathon" ADD CONSTRAINT "Hackathon_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackathonParticipant" ADD CONSTRAINT "HackathonParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HackathonParticipant" ADD CONSTRAINT "HackathonParticipant_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "Hackathon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PastHackathon" ADD CONSTRAINT "PastHackathon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
