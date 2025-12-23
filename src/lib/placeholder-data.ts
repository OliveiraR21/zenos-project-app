import type { User, Project, Task, Notification } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getUserAvatar = (id: string) => PlaceHolderImages.find(p => p.id === `user-${id}`)?.imageUrl || '';

export const users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatarUrl: getUserAvatar('1') },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', avatarUrl: getUserAvatar('2') },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', avatarUrl: getUserAvatar('3') },
  { id: '4', name: 'Diana Miller', email: 'diana@example.com', avatarUrl: getUserAvatar('4') },
  { id: '5', name: 'Ethan Davis', email: 'ethan@example.com', avatarUrl: getUserAvatar('5') },
];

export const projects: Project[] = [
  {
    id: 'p1',
    name: 'Redesenho do Site Zenos',
    description: 'Revisão completa do principal site de marketing e identidade da marca.',
    ownerId: '1',
    memberIds: ['1', '2', '4'],
  },
  {
    id: 'p2',
    name: 'Lançamento App Móvel Q3',
    description: 'Desenvolver e lançar o novo aplicativo móvel para iOS e Android.',
    ownerId: '3',
    memberIds: ['1', '3', '5'],
  },
  {
    id: 'p3',
    name: 'Upgrade da Infraestrutura da API',
    description: 'Migrar os serviços de backend para uma nova infraestrutura mais escalável.',
    ownerId: '2',
    memberIds: ['2', '4', '5'],
  },
   {
    id: 'p4',
    name: 'Fluxo de Onboarding de Clientes',
    description: 'Melhorar a experiência do novo usuário e o processo de onboarding.',
    ownerId: '1',
    memberIds: ['1', '4'],
  },
];


const getFutureDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
};

const getPastDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
}

export const tasks: Task[] = [
  {
    id: 't1',
    projectId: 'p1',
    title: 'Desenhar mockups da nova homepage',
    description: 'Criar mockups de alta fidelidade no Figma para o novo layout da homepage.',
    status: 'in-progress',
    priority: 'high',
    assigneeId: '4',
    dueDate: getFutureDate(5),
    tags: ['UI', 'Design'],
    subtasks: [
      { id: 'st1', title: 'Estruturar layouts', isCompleted: true },
      { id: 'st2', title: 'Escolher paleta de cores', isCompleted: true },
      { id: 'st3', title: 'Desenhar componentes finais', isCompleted: false },
    ],
    attachments: [],
    comments: [
        { id: 'c1', content: "Aqui estão os primeiros rascunhos, me digam o que acham!", authorId: '4', createdAt: getPastDate(1)},
        { id: 'c2', content: "Ficou ótimo! Podemos tentar uma versão com o CTA principal mais para cima?", authorId: '1', createdAt: getPastDate(0)},
    ],
    createdAt: getPastDate(2),
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'Desenvolver componentes da landing page',
    description: 'Construir os componentes React para a nova landing page com base nos designs do Figma.',
    status: 'todo',
    priority: 'high',
    assigneeId: '2',
    dueDate: getFutureDate(12),
    tags: ['Desenvolvimento', 'React'],
    subtasks: [],
    attachments: [],
    comments: [],
    createdAt: getPastDate(1),
  },
  {
    id: 't3',
    projectId: 'p1',
    title: 'Configurar teste A/B para novo título',
    description: 'Implementar teste A/B para determinar a cópia de título mais eficaz.',
    status: 'todo',
    priority: 'medium',
    assigneeId: '1',
    dueDate: getFutureDate(15),
    tags: ['Marketing', 'Teste'],
    subtasks: [],
    attachments: [],
    comments: [],
    createdAt: getPastDate(0),
  },
  {
    id: 't4',
    projectId: 'p2',
    title: 'Corrigir bug de autenticação no Android',
    description: 'Usuários estão relatando serem desconectados aleatoriamente em dispositivos Android.',
    status: 'blocked',
    priority: 'high',
    assigneeId: '5',
    dueDate: getFutureDate(2),
    tags: ['Bug', 'Android'],
    subtasks: [],
    attachments: [],
    comments: [
        {id: 'c3', content: "Estou bloqueado nisso até que a nova API de backend seja implantada.", authorId: '5', createdAt: getPastDate(0)}
    ],
    createdAt: getPastDate(3),
  },
  {
    id: 't5',
    projectId: 'p2',
    title: 'Finalizar capturas de tela da loja de aplicativos',
    description: 'Criar e selecionar as capturas de tela finais para as listagens da App Store e Google Play.',
    status: 'done',
    priority: 'low',
    assigneeId: '3',
    dueDate: getPastDate(1),
    tags: ['Marketing'],
    subtasks: [],
    attachments: [],
    comments: [],
    createdAt: getPastDate(5),
  },
  {
    id: 't6',
    projectId: 'p3',
    title: 'Provisionar novos servidores de banco de dados',
    description: 'Configurar os novos servidores de banco de dados no ambiente de produção.',
    status: 'in-progress',
    priority: 'high',
    assigneeId: '2',
    dueDate: getFutureDate(3),
    tags: ['DevOps', 'Infraestrutura'],
    subtasks: [],
    attachments: [],
    comments: [],
    createdAt: getPastDate(1),
  },
  {
    id: 't7',
    projectId: 'p1',
    title: 'Escrever post no blog anunciando o redesenho',
    description: 'Esboçar um post para o blog da empresa sobre o próximo redesenho do site.',
    status: 'todo',
    priority: 'medium',
    assigneeId: '1',
    dueDate: getFutureDate(20),
    tags: ['Conteúdo'],
    subtasks: [],
    attachments: [],
    comments: [],
    createdAt: getFutureDate(1),
  },
   {
    id: 't8',
    projectId: 'p2',
    title: 'Desenvolver tela de perfil de usuário',
    description: 'Construir a UI para a seção de perfil do usuário do aplicativo móvel.',
    status: 'in-progress',
    priority: 'medium',
    assigneeId: '3',
    dueDate: getFutureDate(8),
    tags: ['iOS', 'Android', 'UI'],
     subtasks: [
      { id: 'st4', title: 'Implementação do layout', isCompleted: true },
      { id: 'st5', title: 'Conectar à API', isCompleted: false },
      { id: 'st6', title: 'Adicionar upload de avatar', isCompleted: false },
    ],
    attachments: [],
    comments: [],
    createdAt: getPastDate(4),
  },
  {
    id: 't9',
    projectId: 'p3',
    title: 'Executar testes de carga nos novos endpoints da API',
    description: 'Testar a nova infraestrutura para garantir que ela atenda aos requisitos de desempenho.',
    status: 'todo',
    priority: 'high',
    assigneeId: '5',
    dueDate: getFutureDate(10),
    tags: ['Teste', 'Performance'],
    subtasks: [],
    attachments: [],
    comments: [],
    createdAt: getFutureDate(2),
  },
  {
    id: 't10',
    projectId: 'p1',
    title: 'Atualizar termos de serviço',
    description: 'Revisão legal e atualização do documento de termos de serviço.',
    status: 'done',
    priority: 'low',
    dueDate: getPastDate(5),
    tags: ['Legal'],
    subtasks: [],
    attachments: [],
    comments: [],
    createdAt: getPastDate(10),
  },
];

export const notifications: Notification[] = [
    {
        id: 'n1',
        message: 'Alice Johnson atribuiu a você "Corrigir bug de autenticação no Android".',
        isRead: false,
        createdAt: getPastDate(1),
        link: '/project/p2/board'
    },
    {
        id: 'n2',
        message: 'Um novo comentário foi adicionado a "Desenhar mockups da nova homepage".',
        isRead: false,
        createdAt: getPastDate(0),
        link: '/project/p1/board'
    },
    {
        id: 'n3',
        message: 'A data de vencimento para "Provisionar novos servidores de banco de dados" é amanhã.',
        isRead: true,
        createdAt: getPastDate(0),
        link: '/project/p3/board'
    },
    {
        id: 'n4',
        message: 'Bob Williams concluiu a tarefa "Finalizar capturas de tela da loja de aplicativos".',
        isRead: true,
        createdAt: getPastDate(1),
        link: '/project/p2/board'
    }
]
