@echo off
echo Resetovanje baze sa novom strukturom...
set PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION=moze
npx prisma db push --force-reset
echo.
echo Pokretanje seed skript-a...
npx tsx prisma/sql-seed.ts
echo.
echo Pokretanje servera...
npm run dev