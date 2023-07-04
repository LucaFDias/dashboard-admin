<h1>Painel Administrativo com Next.js, Prisma e MySQL</h1>
<p>Este é um projeto de um painel administrativo construído utilizando as seguintes tecnologias: Next.js, shadcnUI, Prisma e MySQL (PlanetScaledb). Ele permite a criação, leitura, atualização e exclusão (CRUD) de dados em um banco de dados MySQL, além de fornecer uma interface amigável para gerenciar conteúdo administrativo.</p>

<h3>Funcionalidades</h3>
<p>Autenticação de usuário com controle de acesso. (Clerk Auth, acesso com Google)</p>
<p>Permite que o administrador utilize um único banco de dados para administradar vários Apps.</p>
<p>Interface intuitiva para gerenciamento de conteúdo.</p>
<p>CRUD de dados no banco de dados MySQL.</p>
<p>Integração com a biblioteca Prisma para facilitar a comunicação com o banco de dados.</p>

<h3>Requisitos</h3>

<p>Certifique-se de ter as seguintes dependências instaladas em sua máquina de desenvolvimento:</p>
<p>Node.js</p>
<p>NPM (gerenciador de pacotes do Node.js)</p>
<p>PlanetScaledb</p>
<p>Conta no PlanetScaleDB (https://planetscale.com)</p>
<p>Conta no Clerck Auth (https://clerck.com)</p>

<h3>Configurações</h3>

<p>Renomeie o arquivo .env e preencha as variáveis de ambiente com suas configurações:</p>
<p>CLERCK_API_KEY=YOUR_CLERCK_API_KEY <br/>
DATABASE_URL=YOUR_DATABASE_URL</p>

<p>
  Execute as migrações do Prisma para criar a estrutura do banco de dados:<br/>
  npx prisma migrate dev
</p>
